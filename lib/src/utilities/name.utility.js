const { isIdentifier } = require('typescript');

module.exports = (node) => {
    const { name, pos, end } = node;
    const key =
        (name !== undefined && isIdentifier(name))
            ? name.text
            : JSON.stringify({ pos, end });
    return key;
};
