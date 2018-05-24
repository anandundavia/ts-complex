const { createSourceFile } = require('typescript');
const { existsSync, readFileSync } = require('fs');
const { reduce } = require('lodash');

const halstead = require('./halstead.service');
const cyclomatic = require('./cyclomatic.service');

exports.calculate = (fileName, target) => {
    if (!existsSync(fileName)) {
        throw new Error(`File "${fileName}" does not exists`);
    }
    const sourceText = readFileSync(fileName).toString();
    const source = createSourceFile(fileName, sourceText, target);
    const perFunctionHalstead = halstead.calculate(source);
    const perFunctionCyclomatic = cyclomatic.calculate(source);

    const sloc = (sourceText.split('\n').filter(aLine => !!aLine).length);

    const maxHalsteadVolume = reduce(
        perFunctionHalstead,
        (result, value) => Math.max(result || -Infinity, value.volume),
    );

    const averageHalsteadVolume = reduce(
        perFunctionHalstead,
        (result, value) => {
            let { avg, n } = (result || {});
            avg = (avg || 0);
            n = (n || 0);
            if (value.volume) {
                avg = ((avg * n) + value.volume || 0) / (n + 1);
                n += 1;
            }
            return { avg, n };
        },
    ).avg;

    const maxCyclomaticComplexity = reduce(
        perFunctionCyclomatic,
        (result, value) => Math.max(result || -Infinity, value),
    );

    const averageCyclomaticComplexity = reduce(
        perFunctionCyclomatic,
        (result, value) => {
            let { avg, n } = (result || {});
            avg = (avg || 0);
            n = (n || 0);
            if (value) {
                avg = ((avg * n) + value || 0) / (n + 1);
                n += 1;
            }
            return { avg, n };
        },
    ).avg;

    const averageMaintainability =
        Number.parseFloat((
            171
            - (5.2 * Math.log(averageHalsteadVolume))
            - (0.23 * averageCyclomaticComplexity)
            - (16.2 * Math.log(sloc))).toFixed(2));

    const minMaintainability =
        Number.parseFloat((
            171
            - (5.2 * Math.log(maxHalsteadVolume))
            - (0.23 * maxCyclomaticComplexity)
            - (16.2 * Math.log(sloc))).toFixed(2));

    return { averageMaintainability, minMaintainability };
};
