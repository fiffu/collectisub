const DATABASE = new Map();


module.exports = {
    get(subid, fallback=undefined) {
        return DATABASE[subid] || fallback;
    },

    set(subid, values) {
        if (!values.timestamp) values.timestamp = Date.now();
        DATABASE[subid] = values;
    },

    has(subid) {
        return this.get(subid) ? true : false;
    }
}
