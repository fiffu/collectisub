const db = require('./db/index');
const project = require('./project');
const { getExtension } = require('./util/index');


async function submitFile(file) {
    if (!file)
        throw new Error('no file uploaded');

    try {
        const filename = file.originalname;
        const ext = getExtension(filename);
        const projId = await project.submitFile(file.buffer, filename, ext);
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
            const projId = await submitFile(file);
            return res.send({ projId });
        } catch (ex) {
            return res.status(500).send(ex.message || ex);
        }
    });

    app.get('/projects/:projId', async (req, res) => {
        const { projId } = req.params;
        try {
            const data = await project.getData(projId);
            const meta = await project.getMeta(projId);
            Object.assign(data, meta);
            return res.json(data);
        } catch (ex) {
            if (ex instanceof project.NotFoundError)
                return res.status(404).send('Not Found');
            else
                return res.status(500).send('Internal Server Error');
        }
    });

    app.post('/projects/:projId', async (req, res) => {
        const projId = req.params.projId;
        const parsed = req.body;
        try {
            const { timestamp } = await project.setData(projId, parsed);
            return res.json({ timestamp });
        } catch (ex) {
            console.error(ex);
            return res.status(500).send('Internal Server Error');
        }
    });

    app.get('/projects/:projId/:userId', (req, res) => {
        const { projId, userId } = req.params;
        res.status(503).send('Service Unavailable');
    });

    app.post('/projects/:projId/:userId', (req, res) => {
        const { projId, userId } = req.params;
        const body = req.body;
        res.status(503).send('Service Unavailable');
    });

    app.get('/init/:secret', async (req, res) => {
        const secret = process.env.secret;
        if (secret && secret === req.params.secret)
            await db.init();

        return res.status(200).send();
    })
};


module.exports = {
    setRoutes
};
