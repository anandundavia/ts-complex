const { forEachChild, SyntaxKind, createSourceFile } = require('typescript');
const { isFunctionWithBody } = require('tsutils');
const { existsSync, readFileSync } = require('fs');

const getNodeName = require('../utilities/name.utility');

const isIdentifier = kind => kind === SyntaxKind.Identifier;
const isLiteral = kind =>
    kind >= SyntaxKind.FirstLiteralToken &&
    kind <= SyntaxKind.LastLiteralToken;

const isToken = kind =>
    kind >= SyntaxKind.FirstPunctuation &&
    kind <= SyntaxKind.LastPunctuation;

const isKeyword = kind =>
    kind >= SyntaxKind.FirstKeyword &&
    kind <= SyntaxKind.LastKeyword;

const isAnOperator = node => isToken(node.kind) || isKeyword(node.kind);
const isAnOperand = node => isIdentifier(node.kind) || isLiteral(node.kind);

const getOperatorsAndOperands = (node) => {
    const output = {
        operators: { total: 0, _unique: new Set([]), unique: 0 },
        operands: { total: 0, _unique: new Set([]), unique: 0 },
    };
    /* eslint-disable no-plusplus */
    forEachChild(node, function cb(currentNode) {
        if (isAnOperand(currentNode)) {
            output.operands.total++;
            output.operands._unique.add(currentNode.text || currentNode.escapedText);
        } else if (isAnOperator(currentNode)) {
            output.operators.total++;
            output.operators._unique.add(currentNode.text || currentNode.kind);
        }
        forEachChild(currentNode, cb);
    });
    /* eslint-enable no-plusplus */
    output.operands.unique = output.operands._unique.size;
    output.operators.unique = output.operators._unique.size;

    output.operators._unique = Array.from(output.operators._unique);
    output.operands._unique = Array.from(output.operands._unique);

    return output;
};

const getHalstead = (node) => {
    if (isFunctionWithBody(node)) {
        const { operands, operators } = getOperatorsAndOperands(node);
        const length = operands.total + operators.total;
        const vocabulary = operands.unique + operators.unique;

        // If legnth is 0, all other values will be NaN
        if (length === 0 || vocabulary === 1) return {};

        const volume = length * Math.log2(vocabulary);
        const difficulty = (operators.unique / 2) * (operands.total / operands.unique);
        const effort = volume * difficulty;
        const time = effort / 18;
        const bugsDelivered = (effort ** (2 / 3)) / 3000;

        return {
            length,
            vocabulary,
            volume,
            difficulty,
            effort,
            time,
            bugsDelivered,
            operands,
            operators,
        };
    }
    return {};
};


// Returns the halstead volume for a function
// If passed node is not a function, returns empty object
const calculateFromSource = (ctx) => {
    const output = {};
    forEachChild(ctx, function cb(node) {
        if (isFunctionWithBody(node)) {
            const name = getNodeName(node);
            output[name] = getHalstead(node);
        }
        forEachChild(node, cb);
    });
    return output;
};
exports.calculateFromSource = calculateFromSource;

exports.calculate = (filePath, target) => {
    if (!existsSync(filePath)) {
        throw new Error(`File "${filePath}" does not exists`);
    }
    const sourceText = readFileSync(filePath).toString();
    const source = createSourceFile(filePath, sourceText, target);
    return calculateFromSource(source);
};
