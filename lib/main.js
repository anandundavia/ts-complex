const { ScriptTarget } = require('typescript');

const maintainability = require('./src/services/maintainability.service');

const file = './ts/sample.ts';
const op = maintainability.calculate(file, ScriptTarget.ES2015);
console.log(op);
