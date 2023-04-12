const axios = require("axios");
const {loadImage, createCanvas} = require("canvas");
const fs = require("fs");

async function editImage(req) {

    // let response = await axios({
    //     method: 'get',
    //     url: URL.createObjectURL(req.file),
    //     responseType: 'arraybuffer'
    // })
    console.log(req.file);
    let image = await loadImage(req.file.buffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    console.log(req.body.vertices)
    const linesToDraw = getLines(req.body.vertices, req.body.tCols, req.body.tRows)

    for (let i = 0; i < linesToDraw.length; i++) {
        let currLine = linesToDraw[i];
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.lineTo(currLine[0], currLine[1]);
        ctx.lineTo(currLine[2], currLine[3]);
        ctx.stroke();
    }

    return canvas.toBuffer("image/jpeg")

}

// getLines takes in the parameters used from the front end and returns an array of lines to be drawn on the photo
// the result is in the form [x0, y0, x1, y1]
// all arguments are given directly from the frontend
function getLines(vertices, tCols, tRows) {
    let lineArray = []
    lineArray.push([vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y]);
    lineArray.push([vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y]);
    lineArray.push([vertices[2].x, vertices[2].y, vertices[3].x, vertices[3].y]);
    lineArray.push([vertices[3].x, vertices[3].y, vertices[0].x, vertices[0].y]);

    for (let i = 0; i < tCols.length; i++) {
        let t = tCols[i];
        let x0 = vertices[0].x * (1 - t) + vertices[1].x * t;
        let y0 = vertices[0].y * (1 - t) + vertices[1].y * t;
        let x1 = vertices[3].x * (1 - t) + vertices[2].x * t;
        let y1 = vertices[3].y * (1 - t) + vertices[2].y * t;
        lineArray.push([x0, y0, x1, y1]);
    }
    for (let i = 0; i < tRows.length; i++) {
        let t = tRows[i];
        let x0 = vertices[1].x * (1 - t) + vertices[2].x * t;
        let y0 = vertices[1].y * (1 - t) + vertices[2].y * t;
        let x1 = vertices[0].x * (1 - t) + vertices[3].x * t;
        let y1 = vertices[0].y * (1 - t) + vertices[3].y * t;
        lineArray.push([x0, y0, x1, y1]);
    }
    return lineArray;
}

module.exports = {editImage}