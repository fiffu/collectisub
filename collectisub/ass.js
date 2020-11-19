const assParser = require('ass-parser');

module.exports = {
    parser(buffer) {
        const text = buffer.toString('utf8');
        return assParser(text);
    }
}
