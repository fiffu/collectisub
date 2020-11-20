const md5 = require('md5');

const db = require('./database');
const { getExtension } = require('./util/index');

const PARSERS = {
    ass: require('./ass').parser,
}


function parse(buffer, ext) {
    // can fetch a hash from the file
    // returning uuid now just for placeholder
    const subid = md5(buffer);
    if (!db.has(subid)) {
        const parseFunc = PARSERS[ext];
        if (!parseFunc)
            throw new Error(`Unsupported file format: ${ext}`);

        const parsed = parseFunc(buffer);
        db.set(subid, { parsed, ext });
    }
    return subid;
}

async function fetchProject(file) {
    if (!file)
        throw new Error('no file uploaded');

    try {
        const ext = getExtension(file.originalname);
        const subid = parse(file.buffer, ext);
        return subid;
    } catch (e) {
        console.error(e);
        throw new Error('Internal Server Error');
    }
}


/**
 * Set up REST API routes on the given Express instance
 * @param {*} app - Express app instance
 * @param {*} multer - Multer object
 */
function setRoutes(app, multer) {
    app.post('/projects', multer.single('subFile'), async (req, res) => {
        const file = req.file;
        if (!file)
            return res.status(403).send({message: 'no file uploaded'});
        
        try {
            const subid = await fetchProject(file);
            return res.send({ subid });
        } catch (ex) {
            return res.status(500).send(ex.message || ex);
        }
    });

    app.get('/projects/:subid', (req, res) => {
        const subid = req.params.subid;
        const data = db.get(subid);
        if (!data)
            return res.status(404).send('Not Found');
        return res.json(data);
    });

    app.post('/projects/:subid', (req, res) => {
        const { parsed, ext } = req.body;
        db.set(subid, { parsed, ext });
    });

    app.get('/:subid/:userid');
    app.post('/:subid/:userid');
};


module.exports = {
    setRoutes
};
