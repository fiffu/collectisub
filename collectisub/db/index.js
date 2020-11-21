const PostgresDao = require('./adaptor-postgres');
const InMemoryDao = require('./adaptor-memory-map');

function connect() {
    try {
        return new PostgresDao();
    } catch (ex) {
        const msg = ex.message || ex;
        console.warn(`Postgres adaptor failed (${msg}), falling back to in-memory db`);
        return new InMemoryDao();
    }
}

module.exports = connect();
