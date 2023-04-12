const express = require('express');
const cors = require('cors');
const multer = require("multer");
const bodyParser = require('body-parser');
const app = express();
const upload = multer();
require('dotenv').config();

const {documentaiScan} = require( "./utilities/document.js");
const {editImage} = require("./utilities/lineEditor.js")

const corsOpts = {
    origin: '*'
};

app.use(cors(corsOpts));
app.use(bodyParser.json())


app.post('/', upload.single("selectedFile"), async (req, res) => {
    req.body.vertices = req.body.vertices.split(",{");
    for (let i = 1; i < req.body.vertices.length; i++) {
        req.body.vertices[i] = '{' + req.body.vertices[i];
    }
    for (let i = 0; i < req.body.vertices.length; i++) {
        req.body.vertices[i] = JSON.parse(req.body.vertices[i]);
    }



    const editedImage = await editImage(req);


    const result = await documentaiScan(editedImage);
    res.json({result: result});
});



const port = process.env.PORT || 8000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});