const { ScriptTarget } = require('typescript');
const maintainability = require('./src/services/maintainability.service');
const halstead = require('./src/services/halstead.service');
const cyclomatic = require('./src/services/cyclomatic.service');
const sloc = require('./src/services/sloc.service');

exports.calculateMaintainability =
    filePath => maintainability.calculate(filePath, ScriptTarget.ES2015);

exports.calculateHalstead =
    filePath => halstead.calculate(filePath, ScriptTarget.ES2015);

exports.calculateSloc =
    filePath => sloc.calculateSloc(filePath, ScriptTarget.ES2015);

exports.calculateCyclomaticComplexity =
    filePath => cyclomatic.calculate(filePath, ScriptTarget.ES2015);
