const express = require('express');
const multer = require('multer');

const { getExtension } = require('./util/index');
const collectisub = require('./collectisub/index');


const PORT = process.env.PORT || 8080;

const ACCEPT_EXTENSIONS = ['ass'];

// todo add filefilter  https://github.com/expressjs/multer#filefilter
const mul = multer({
    filefilter(req, file, callback) {
        const ext = getExtension(file.originalname);
        return callback(null, ACCEPT_EXTENSIONS.contains(ext));
    }
});


async function handleSubmit(req, res) {
    const file = req.file;
    if (!file) {
        return res.send({
            status: 403,
            message: 'no file uploaded'
        });
    }

    try {
        const ext = getExtension(file.originalname);
        const subid = collectisub.parse(file.buffer, ext);
        return res.json({
            subid
        });
    } catch (e) {
        console.error(e);
        res.status(500);
        return res.send({
            message: e.message || 'Internal Server Error'
        })
    }
}


express()
    .use(express.static('public'))

    .post('/submit', mul.single('subFile'), handleSubmit)

    .get('/sub/:id', (req, res) => {
        const data = collectisub.load(req.params.id);
        return res.json(data);
    })

    .listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
