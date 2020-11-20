const parsers = require('./parsers/index');

function create(projId, filename, ext, buffer) {
    const parseFunc = parsers[ext];
    if (!parseFunc)
        throw new Error(`Unsupported file format: ${ext}`);

    const parsed = parseFunc(buffer);
    return {
        projId, filename, ext, parsed
    }
}

module.exports = {
    create,
}
