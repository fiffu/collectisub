const DATABASE = new Map();

class InMemoryDao {
    constructor() {
        this.init();
    }

    async init() {
        const tables = [
            'projects_meta',
            'projects_data',
            'projects_originaldata',
            'users',
        ]
        this.db = {};
        tables.forEach(table => this.db[table] = new Map());
    }

    async createProject(projid, filename, format, parsed) {
        const timestamp = Date.now();
        this.db.projects_data[projid]         = { projid, timestamp, parsed };
        this.db.projects_originaldata[projid] = { projid, timestamp, parsed };
        this.db.projects_meta[projid]         = { projid, filename, format };
    }

    /**
     * @returns {ProjectMetaRecord}
     */
    async getProjectMeta(projid) {
        return this.db.projects_meta[projid];
    }

    async setProjectMeta(projid, values) {
        delete values.timestamp;
        Object.assign(this.db.projects_meta[projid], values);
    }


    /**
     * @returns {ProjectDataRecord}
     */
    async getProject(projid) {
        return this.db.projects_data[projid];
    }

    async setProject(projid, parsed) {
        const timestamp = Date.now();
        this.db.projects_data[projid] = { projid, timestamp, parsed };
        return timestamp;
    }


    /**
     * @returns {UserRecord}
     */
    async getUser(username) {
        return this.db.users[username];
    }

    async setUser(username, values) {
        Object.assign(this.db.users[username], values);
    }
}

module.exports = InMemoryDao;

// TYPEDEFS ////////////////////////////////////////////////////
/**
 * @typedef ProjectMetaRecord
 * @property {string} projid - md5 hash of origin file
 * @property {string} filename - name of origin file
 * @property {string} format - subtitle format
 *//**
 * @typedef ProjectDataRecord
 * @property {string} projid - md5 hash of origin file
 * @property {Date} timestamp - last modified timestamp
 * @property {object} parsed - file parse tree
 *//**
 * @typedef UserRecord
 * @property {string} username
 * @property {string} secret
 * @property {Array<string>} projects - IDs of projects user is involved in
 */
////////////////////////////////////////////////////////////////
