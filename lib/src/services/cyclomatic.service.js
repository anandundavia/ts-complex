const { forEachChild, SyntaxKind } = require('typescript');
const { isFunctionWithBody } = require('tsutils');

const getNodeName = require('../utilities/name.utility');

const increasesComplexity = (node) => {
    /* eslint-disable indent */
    switch (node.kind) {
        case SyntaxKind.CaseClause:
            return (node).statements.length > 0;
        case SyntaxKind.CatchClause:
        case SyntaxKind.ConditionalExpression:
        case SyntaxKind.DoStatement:
        case SyntaxKind.ForStatement:
        case SyntaxKind.ForInStatement:
        case SyntaxKind.ForOfStatement:
        case SyntaxKind.IfStatement:
        case SyntaxKind.WhileStatement:
            return true;

        case SyntaxKind.BinaryExpression:
            switch ((node).operatorToken.kind) {
                case SyntaxKind.BarBarToken:
                case SyntaxKind.AmpersandAmpersandToken:
                    return true;
                default:
                    return false;
            }

        default:
            return false;
    }
    /* eslint-enable indent */
};

exports.calculate = (ctx) => {
    let complexity = 0;
    const output = {};
    forEachChild(ctx, function cb(node) {
        if (isFunctionWithBody(node)) {
            const old = complexity;
            complexity = 1;
            forEachChild(node, cb);
            const name = getNodeName(node);
            output[name] = complexity;
            complexity = old;
        } else {
            if (increasesComplexity(node)) {
                complexity += 1;
            }
            forEachChild(node, cb);
        }
    });
    return output;
};
