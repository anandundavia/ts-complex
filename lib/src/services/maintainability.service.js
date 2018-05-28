const { createSourceFile } = require('typescript');
const { existsSync, readFileSync } = require('fs');
const {
    reduce,
    mergeWith,
    omitBy,
    isNull,
} = require('lodash');

const halstead = require('./halstead.service');
const cyclomatic = require('./cyclomatic.service');
const sloc = require('./sloc.service');

exports.calculate = (filePath, target) => {
    if (!existsSync(filePath)) {
        throw new Error(`File "${filePath}" does not exists`);
    }
    const sourceText = readFileSync(filePath).toString();
    const source = createSourceFile(filePath, sourceText, target);

    const perFunctionHalstead = halstead.calculateFromSource(source);
    const perFunctionCyclomatic = cyclomatic.calculateFromSource(source);
    const sourceCodeLength = sloc.calculate(sourceText);

    const customizer = (src, val) => {
        if (!!src && Object.keys(src).length !== 0 && !!val) {
            return { volume: src.volume, cyclomatic: val };
        }
        return null;
    };
    const merged = mergeWith(perFunctionHalstead, perFunctionCyclomatic, customizer);
    const perFunctionMerged = omitBy(merged, isNull);

    const functions = Object.keys(perFunctionMerged);
    if (functions.length === 0) {
        return { averageMaintainability: -1, minMaintainability: -1 };
    }

    const maximumMatrics = reduce(
        perFunctionMerged,
        (result, value) => {
            /* eslint-disable no-param-reassign */
            result.volume = Math.max(result.volume, value.volume);
            result.cyclomatic = Math.max(result.cyclomatic, value.cyclomatic);
            return result;
            /* eslint-enable no-param-reassign */
        },
        perFunctionMerged[functions[0]],
    );

    const averageMatrics = { cyclomatic: 0, volume: 0, n: 0 };
    functions.forEach((aFunction) => {
        const matric = perFunctionMerged[aFunction];
        averageMatrics.cyclomatic += matric.cyclomatic;
        averageMatrics.volume += matric.volume;
        /* eslint-disable no-plusplus */
        averageMatrics.n++;
        /* eslint-enable no-plusplus */
    });
    averageMatrics.cyclomatic /= averageMatrics.n;
    averageMatrics.volume /= averageMatrics.n;

    const averageMaintainability =
        Number.parseFloat((
            171
            - (5.2 * Math.log(averageMatrics.volume))
            - (0.23 * averageMatrics.cyclomatic)
            - (16.2 * Math.log(sourceCodeLength))).toFixed(2));

    const minMaintainability =
        Number.parseFloat((
            171
            - (5.2 * Math.log(maximumMatrics.volume))
            - (0.23 * maximumMatrics.cyclomatic)
            - (16.2 * Math.log(sourceCodeLength))).toFixed(2));

    return { averageMaintainability, minMaintainability };
};
