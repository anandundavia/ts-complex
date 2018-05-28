const getComments = (text) => {
    // Regex that matches all the strigns starting with //
    const singleLineCommentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
    return text ? (text.match(singleLineCommentsRegex) || []) : [];
};

exports.calculate = (sourceText) => {
    const comments = getComments(sourceText);
    /* eslint-disable no-plusplus, no-param-reassign */
    for (let i = 0; i < comments.length; i++) {
        const aMatched = comments[i];
        sourceText = (sourceText.replace(aMatched, '')).trim();
    }
    /* eslint-enable no-plusplus, no-param-reassign */
    // console.log(sourceText);
    return (sourceText.split('\n').map(aLine => aLine.trim()).filter(aLine => !!aLine).length);
};
