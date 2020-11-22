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

    async createProject(projId, filename, format, parsed) {
        const timestamp = Date.now();
        this.db.projects_data[projId]         = { projId, timestamp, parsed };
        this.db.projects_originaldata[projId] = { projId, timestamp, parsed };
        this.db.projects_meta[projId]         = { projId, filename, format };
    }

    /**
     * @returns {ProjectMetaRecord}
     */
    async getProjectMeta(projId) {
        return this.db.projects_meta[projId];
    }

    async setProjectMeta(projId, values) {
        delete values.timestamp;
        Object.assign(this.db.projects_meta[projId], values);
    }


    /**
     * @returns {ProjectDataRecord}
     */
    async getProject(projId) {
        return this.db.projects_data[projId];
    }

    async setProject(projId, parsed) {
        const timestamp = Date.now();
        this.db.projects_data[projId] = { projId, timestamp, parsed };
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
 * @property {string} projId - md5 hash of origin file
 * @property {string} filename - name of origin file
 * @property {string} format - subtitle format
 *//**
 * @typedef ProjectDataRecord
 * @property {string} projId - md5 hash of origin file
 * @property {Date} timestamp - last modified timestamp
 * @property {object} parsed - file parse tree
 *//**
 * @typedef UserRecord
 * @property {string} username
 * @property {string} secret
 * @property {Array<string>} projects - IDs of projects user is involved in
 */
////////////////////////////////////////////////////////////////
