const md5 = require('md5');

const db = require('./database');
const project = require('./project');
const { getExtension } = require('./util/index');


function findProject(buffer, filename, ext) {
    const projId = md5(buffer);
    if (!db.has(projId)) {
        const newProject = project.create(projId, filename, ext, buffer);
        db.set(projId, newProject);
    }
    return projId;
}

async function fetchProject(file) {
    if (!file)
        throw new Error('no file uploaded');

    try {
        const filename = file.originalname;
        const ext = getExtension(filename);
        const projId = findProject(file.buffer, filename, ext);
        return projId;
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
            const projId = await fetchProject(file);
            return res.send({ projId });
        } catch (ex) {
            return res.status(500).send(ex.message || ex);
        }
    });

    app.get('/projects/:projId', (req, res) => {
        const projId = req.params.projId;
        const data = db.get(projId);
        if (!data)
            return res.status(404).send('Not Found');
        return res.json(data);
    });

    app.post('/projects/:projId', (req, res) => {
        const { parsed, ext } = req.body;
        db.set(projId, { parsed, ext });
    });

    app.get('/:projId/:userId');
    app.post('/:projId/:userId');
};


module.exports = {
    setRoutes
};
