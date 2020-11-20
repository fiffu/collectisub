const DATABASE = new Map();


module.exports = {
    get(id, fallback=undefined) {
        return DATABASE[id] || fallback;
    },

    set(id, values) {
        if (!values.timestamp) values.timestamp = Date.now();
        DATABASE[id] = values;
    },

    has(id) {
        return this.get(id) ? true : false;
    }
}
