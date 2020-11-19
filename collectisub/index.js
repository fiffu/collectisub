const md5 = require('md5');


const PARSERS = {
    ass: require('./ass').parser,
}


const DATABASE = {};

/**
 * @param {File} fileObj
 */
function parse(buffer, ext) {
    // can fetch a hash from the file
    // returning uuid now just for placeholder
    const subid = md5(buffer);

    if (!DATABASE[subid]) {
        const parseFunc = PARSERS[ext];
        if (!parseFunc) throw new Error('unsupported file format');

        const parsed = parseFunc(buffer);
        save(subid, parsed, ext);
    }

    return subid;
}


function save(subid, parsed, ext) {
    DATABASE[subid] = {
        subid, parsed, ext,
        timestamp: Date.now(),
    }
}

function load(subid) {
    return DATABASE[subid];
}


module.exports = {
    parse,
    load,
};
