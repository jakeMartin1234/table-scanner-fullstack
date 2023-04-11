const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const {documentaiScan} = require( "./utilities/document.js");
const {editImage} = require("./utilities/lineEditor.js")

const corsOpts = {
    origin: '*'
};

app.use(cors(corsOpts));
app.use(bodyParser.json())


app.post('/', async (req, res) => {
    console.log(req.body);

    const editedImage = await editImage(req)
    const result = await documentaiScan(editedImage);
    res.json({result: result});
});



const port = process.env.PORT || 8000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});