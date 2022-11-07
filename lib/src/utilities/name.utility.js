
const fs = require('fs');
const { isIdentifier } = require('typescript');

module.exports = { getNodeName };

let visitedNodes = { };

function getNodeName(node, ctx) {
    const nodeName = getIdentifierName(node);
    visitedNodes = { };
    if (nodeName.includes("@")) {
        const initializerName = getInitializerName(node, ctx);
        if (initializerName) {
            return initializerName;
        }
    }
    return nodeName;
}

function getIdentifierName(node) {
    const { name, pos, end } = node;
    const key =
        (name !== undefined && isIdentifier(name))
            ? name.text
            : `lambda @${pos}:${end}`;
    return key;
};

// function getInitializerName
// traverse the parse tree to asscociate a lambda function with
// the context in which it was declared, for example:
//   const sum = (a,b) => a + b;              // name is "sum"
//   list.forEach(item => console.log(item)); // name is "forEach"
function getInitializerName(node, ctx, ancestorName, propertyName) {
    if (!ctx || !node) {
        return null;
    }
    if (typeof propertyName === 'undefined' )
        propertyName = '';

    if (ctx && typeof(ctx.pos)==='number' && typeof(ctx.end)==='number') {
        const nodeID = `pos:${ctx.pos},end:${ctx.end},${Object.keys(ctx).toString()}`;
        if (visitedNodes[nodeID]) {
            // recursive reference detected
            return null;
        }
        // why do arrays have pos and end properties?????
        if (!Array.isArray(ctx)) {
            visitedNodes[nodeID] = true;
        }
    }
    let name = ctx?.name?.escapedText || ancestorName;

    if (name && ctx && ctx.pos === node.pos && ctx.end === node.end) {
        return `${name} @${ctx.pos}:${ctx.end}`;
    }
    else if (Array.isArray(ctx)) {
        ancestorName = name;
        name = null;
        for (let i=0; i<ctx.length && !name; ++i) {
            name = getInitializerName(node, ctx[i], ancestorName, `${i}`);
        }
        return name;
    }
    else if (typeof ctx === 'object') {
        ancestorName = name;
        name = null;
        const keys = Object.keys(ctx);
        for (let i=0; i<keys.length && !name; ++i) {
            if (typeof ctx[keys[i]] === 'object') {
                name = getInitializerName(node, ctx[keys[i]], ancestorName, keys[i]);
            }
        }
        return name;
    }
}

