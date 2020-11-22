const { Pool } = require('pg');
const fs = require('fs');

/**
 * Extracts from `obj` each key in `yields`, yielding `"key=$N"` placeholders for SQL SET.
 * `$N` starts from $1 by default, where `indexFrom === 1`
 * @param {Object} obj
 * @param {Array<string>} onlyFields
 * @param {Number} indexFrom
 */
function paramsFromObj(obj, onlyFields=undefined, indexFrom=1) {
    const placeholders = [];
    const params = [];

    const fields = onlyFields || Object.keys(obj);

    for (let i=0; i<fields.length; i++) {
        let field = fields[i];
        let val = obj[field];
        if (val) {
            placeholders.push(`${field} = $${i + indexFrom}`);
            params.push(val);
        }
    }

    if (params.length > 0)
        return { params, placeholders }
    return undefined;
}


function buildUpdateQuery(table, newValues, conditions) {
    const update = paramsFromObj(newValues) || {};
    const nParams = (update.params || []).length;
    if (nParams == 0)
        return undefined;

    const where = paramsFromObj(conditions, undefined, nParams + 1);

    const sql = `
        UPDATE ${table} SET ${ update.placeholders.join(',') }
        WHERE ${ where.placeholders.join(' AND ') }`;
    const params = update.params.concat(where.params);
    return { sql, params };
}


class PostgresDao {
    constructor() {
        this.uri = process.env.DATABASE_URL;
        if (!this.uri) {
            throw new Error('DATABASE_URL not defined in environment');
        }
        this.db = new Pool({ connectionString: this.uri, max: 15 });

        const errorFunc = (ex) => { throw ex };
        this.db.query('SELECT 1;')
            .then(_ => console.log('Database ready'))
            .catch(errorFunc);
    }

    async init() {
        const path = `${__dirname}/schema.sql`;
        fs.readFile(path, async (err, res) => {
            if (err || !res)
                return console.error(err || `Empty file at ${path}`);

            try {
                const sql = res.toString('utf8');
                console.log(sql);
                await this.db.query(sql);
                console.log('Initialized database');
            } catch (ex) {
                console.error(ex);
            }
        });
    }

    async _fetchOneRow(sql, params) {
        const res = await this.db.query(sql, params);
        return res[0];
    }

    async _getFromWhere(table, conditions) {
        const { params, placeholders } = paramsFromObj(conditions);
        const sql = `SELECT * FROM ${table} WHERE ${ placeholders.join(' AND ') }`;
        return await this._fetchOneRow(sql, params);
    }

    async _update(table, values, conditions) {
        const query = buildUpdateQuery(table, values, conditions);
        if (query)
            await this.db.query(query.sql, query.params);
    }


    async createProject(projId, filename, format, parsed) {
        const client = await this.db.connect();
        try {
            const timestamp = Date.now();
            await client.query('BEGIN');
            await client.query(
                `INSERT INTO projects_data(projId, timestamp, parsed) VALUES ($1, $2, $3)`,
                [projId, timestamp, parsed]
            );
            await client.query(
                `INSERT INTO projects_originaldata(projId, timestamp, parsed) VALUES ($1, $2, $3)`,
                [projId, timestamp, parsed]
            );
            await client.query(
                `INSERT INTO projects_meta(projId, filename, format) VALUES ($1, $2, $3)`,
                [projId, filename, format]
            )
            await client.query('COMMIT');

        } catch (e) {
            console.error(e);
            await client.query('ROLLBACK');
            throw e;

        } finally {
            client.release();
        }
    }


    /**
     * @returns {ProjectMetaRecord}
     */
    async getProjectMeta(projId) {
        return await this._getFromWhere('projects_meta', { projId });
    }

    async setProjectMeta(projId, values) {
        return await this._update('projects_meta', values, { projId });
    }


    /**
     * @returns {ProjectDataRecord}
     */
    async getProject(projId) {
        return await this._getFromWhere('projects_data', { projId });
    }

    async setProject(projId, values) {
        return await _update('projects_data', values, { projId });
    }


    /**
     * @returns {UserRecord}
     */
    async getUser(username) {
        return await this._getFromWhere('users', { username });
    }

    async setUser(username, values) {
        return await _update('projects_users', values, { username });
    }
}

module.exports = PostgresDao;

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

