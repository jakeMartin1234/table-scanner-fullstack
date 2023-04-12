import React, { useState } from 'react';

function FileUploader(props) {
    const [selectedFile, setSelectedFile] = useState(null);


    function handleFileSelection(event) {
        setSelectedFile(event.target.files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        props.component.handleFileChange(selectedFile)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileSelection} />
            <button type="submit">Upload</button>
        </form>
    );
}

export default FileUploader;
