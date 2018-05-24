const ts = require('typescript');
const { readFileSync } = require('fs');
const {
    isFunctionScopeBoundary,
    isIdentifier,
} = require('tsutils');

const fileNames = ['ts/sample.ts'];

const map = {
    operators: {
        all: [],
        unique: new Set([]),
    },
    operands: {
        all: [],
        unique: new Set([]),
    },
};

const isAKeyword = kind => (kind >= 17 && kind <= 70);
const isAToken = kind => (kind >= 72 && kind <= 144);
const isALiteral = kind => (kind >= 8 && kind <= 13);
const isAnIdentifier = kind => kind === 71;

const isAnOperator = kind => (isAKeyword(kind) || isAToken(kind));
const isAnOperand = kind => (isALiteral(kind) || isAnIdentifier(kind));

const getName = (node) => {
    const { pos, end } = node;
    if (node.name) {
        return node.name.escapedText || node.name.text;
    }
    return JSON.stringify({ pos, end });
};

const calculateHalstead = (sourceFunction) => {
    const functions = {};
    const traverse = (node) => {
        const { kind } = node;
        // if (isAnOperator(kind)) {
        //     map.operators.all.push(node.kind);
        //     map.operators.unique.add(node.kind);
        // } else if (isAnOperand(kind)) {
        //     map.operands.all.push(node.escapedText || node.text);
        //     map.operands.unique.add(node.escapedText || node.text);
        // }
        if (isFunctionScopeBoundary(node)) {
            const name = getName(node);
            functions[name] = 1;
        }
        ts.forEachChild(node, traverse);
    };
    traverse(sourceFunction);
    // const halstead = {};

    // halstead.length = map.operands.all.length + map.operators.all.length;
    // halstead.vocabulary = map.operands.unique.size + map.operators.unique.size;
    // halstead.volume = halstead.length * Math.log2(halstead.vocabulary);
    // halstead.difficulty =
    //     (map.operators.unique.size / 2) * (map.operands.all.length / map.operands.unique.size);
    // halstead.effort = halstead.volume * halstead.difficulty;
    // halstead.time = halstead.effort / 18;
    // halstead.bugsDelivered = (halstead.effort ** (2 / 3)) / 3000;

    // return halstead;
    console.log(functions);
};


function increasesComplexity(node) {
    /* eslint-disable indent */
    switch (node.kind) {
        case ts.SyntaxKind.CaseClause:
            return (node).statements.length > 0;
        case ts.SyntaxKind.CatchClause:
        case ts.SyntaxKind.ConditionalExpression:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WhileStatement:
            return true;

        case ts.SyntaxKind.BinaryExpression:
            switch ((node).operatorToken.kind) {
                case ts.SyntaxKind.BarBarToken:
                case ts.SyntaxKind.AmpersandAmpersandToken:
                    return true;
                default:
                    return false;
            }

        default:
            return false;
    }
    /* eslint-enable indent */
}

function walk(ctx) {
    let complexity = 0;

    return ts.forEachChild(ctx, function cb(node) {
        if (isFunctionScopeBoundary(node)) {
            const old = complexity;
            complexity = 1;
            ts.forEachChild(node, cb);
            const { name } = node;
            const nameStr = name !== undefined && isIdentifier(name) ? name.text : undefined;
            console.log(nameStr, complexity);
            complexity = old;
        } else {
            if (increasesComplexity(node)) {
                complexity += 1;
            }
            return ts.forEachChild(node, cb);
        }
    });
}


fileNames.forEach((aFile) => {
    const program =
        ts.createSourceFile(aFile, readFileSync(aFile).toString(), ts.ScriptTarget.ES2015);
    calculateHalstead(program);
});
