
const { forEachChild, SyntaxKind, createSourceFile } = require('typescript');
const { isFunctionWithBody } = require('tsutils');
const { existsSync, readFileSync, writeFileSync } = require('fs');

const { getNodeName } = require('../utilities/name.utility');

const getComments = (text) => {
    // Regex that matches all the strigns starting with //
    const singleLineCommentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
    return text ? (text.match(singleLineCommentsRegex) || []) : [];
};

const calculate = (sourceText) => {
    const comments = getComments(sourceText);
    /* eslint-disable no-plusplus, no-param-reassign */
    for (let i = 0; i < comments.length; i++) {
        const aMatched = comments[i];
        sourceText = (sourceText.replace(aMatched, '')).trim();
    }
    /* eslint-enable no-plusplus, no-param-reassign */
    return (sourceText.split('\n').map(aLine => aLine.trim()).filter(aLine => !!aLine).length);
};

const getFunctionSLOC = (node, text) => {
    let lines = -1;
    if (typeof node.pos === 'number' && typeof node.end === 'number' &&
        node.pos >= 0 && node.end <= text.length ) {
        lines = calculate(text.substring(node.pos, node.end));
    }
    return lines;
}

const calculateFromSource = (ctx) => {
    const output = {};
    const text = ctx.text;
    forEachChild(ctx, function cb(node) {
        if (isFunctionWithBody(node)) {
            const name = getNodeName(node,ctx);
            output[name] = getFunctionSLOC(node, text);
        }
        forEachChild(node, cb);
    });
    return output;
};

exports.calculate = calculate;
exports.calculateFromSource = calculateFromSource;

exports.calculateSloc = (filePath, target) => {
    if (!existsSync(filePath)) {
        throw new Error(`File "${filePath}" does not exists`);
    }
    const sourceText = readFileSync(filePath).toString();
    const source = createSourceFile(filePath, sourceText, target);

    return calculateFromSource(source);
}
