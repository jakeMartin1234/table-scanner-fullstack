require('dotenv').config();

const {DocumentProcessorServiceClient} =
    require('@google-cloud/documentai').v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
// const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});
const client = new DocumentProcessorServiceClient();

async function documentaiScan(editedImage) {
    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = process.env.GOOGLE_PROCESSOR_LOCATION;

    // Read the file into memory.
    // const fs = require('fs').promises;
    // const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(editedImage).toString('base64');

    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: 'image/jpeg',
        },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const {document} = result;

    // Get all of the document text as one big string
    const {text} = document;

    // Extract shards from the text field
    const getText = textAnchor => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return '';
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;

        return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    console.log('The document contains the following paragraphs:');
    const [page1] = document.pages;
    const table = page1.tables[0]
    const header_row_values = get_table_data(table.headerRows, document.text)
    const body_row_values = get_table_data(table.bodyRows, document.text)
    console.log(`headerRow:  ${header_row_values.toString()}`)
    console.log(`bodyRow:  ${body_row_values.toString()}`)

    let csv = "";
    header_row_values.forEach(function(row) {
        csv += row.map(function(value) {
            // Escape any double quotes in the value
            value = value.replace(/"/g, '""');

            // Surround the value with quotes if it contains commas
            if (value.indexOf(",") !== -1) {
                value = '"' + value + '"';
            }

            return value;
        }).join(",");
        csv += "\n";
    });
    body_row_values.forEach(function(row) {
        csv += row.map(function(value) {
            // Escape any double quotes in the value
            value = value.replace(/"/g, '""');

            // Surround the value with quotes if it contains commas
            if (value.indexOf(",") !== -1) {
                value = '"' + value + '"';
            }

            return value;
        }).join(",");
        csv += "\n";
    });

    return csv
}

function get_table_data(rows, text) {
    let all_values = [];
    for (let row of rows) {
        let current_row_values = [];
        for (let cell of row.cells) {
            current_row_values.push(
                text_anchor_to_text(cell.layout.textAnchor, text)
            );
        }
        all_values.push(current_row_values);
    }
    return all_values;
}

function text_anchor_to_text(text_anchor, text) {
    let response = "";
    // If a text segment spans several lines, it will
    // be stored in different text segments.
    for (let segment of text_anchor.textSegments) {
        let start_index = parseInt(segment.startIndex);
        let end_index = parseInt(segment.endIndex);
        response += text.substring(start_index, end_index);
    }
    return response.trim().replace(/\n/g, " ");
}

module.exports = {documentaiScan}

