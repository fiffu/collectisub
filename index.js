const express = require('express');
const multer = require('multer');

const { getExtension } = require('./collectisub/util/index');
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


const app = express();

app.use(express.static('public'));
app.use(express.json());

collectisub.setRoutes(app, mul);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
