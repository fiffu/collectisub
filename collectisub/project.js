const md5 = require('md5');

const parsers = require('./parsers/index');
const db = require('./db/index');

class NotFoundError extends Error {
};

/**
 * Parses file returning project ID, and creates new project if not found on DB
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} ext
 */
async function submitFile(buffer, filename, ext) {
    const parseFunc = parsers[ext];
    if (!parseFunc)
        throw new Error(`Unsupported file format: ${ext}`);

    const projId = md5(buffer);
    const exists = await db.getProjectMeta(projId)
    if (!exists) {
        const parsed = parseFunc(buffer);
        await db.createProject(projId, filename, ext, parsed);
    }

    return projId;
}

async function getMeta(projId) {
    const proj = db.getProjectMeta(projId);
    if (!proj)
        throw NotFoundError;
    return proj;
}

async function getData(projId, username=undefined) {
    const data = await db.getProject(projId);
    if (!data)
        throw NotFoundError;
    if (username) {
        // todo filter by username...
        throw new Error('filtering by username is not implemented yet');
    }
    return data;
}

async function setData(projId, parsed) {
    const timestamp = await db.setProject(projId, parsed);
    return { projId, timestamp };
}

module.exports = {
    submitFile,
    getMeta,
    getData,
    setData,
    NotFoundError,
}
