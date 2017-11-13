module.exports = $require("./fileB").then(fileB => {
    const strlen = name =>
        name.length;

    const toUpper = value =>
        fileB.toUpper(value);

    return {
        strlen, toUpper
    };
});