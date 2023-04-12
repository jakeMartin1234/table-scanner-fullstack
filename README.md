# table-scanner-fullstack
This is an application that provides a UI which enables photos of tables to be uploaded, parsed and downloaded in a CSV format. The frontend UI enables users to quickly scale lines over the photo of the graph which enables the program to yeild more accurate results.
Over the following days I will automize the setup as much as I can and provide instructions in this README to get this program setup on any computer. I will also publish the application once I beleive it is ready.
A Link to a demo of how to use the UI is here: https://www.youtube.com/watch?v=nS9eFWnF_Os.

## Set up
Since this project runs in docker the only thing required to do get this project running locally is download docker and get authenticated with the Google Cloud Platform.
Ensure that your terminal is in the root directory of the project and run the following commands to create your environment variables
```bash
cp backend/sample.env backend/.env
cp frontend/sample.env frontend/.env
```

Next, follow the instructions at this [link](https://cloud.google.com/document-ai/docs/process-documents-client-libraries#client-libraries-install-nodejs).

When the JSON key that authenticates the program to the Google Cloud Console is downloaded,  take the .json file out of the Downloads folder, rename it to 'google-auth-key.json' and put it into the /backend folder of the project.

When creating the processor on the Processor's Page, ensure that you are selecting the Form Parser in the Processor Gallery as the type of Processor.
Take the Processor ID and Project ID and put it in the /frontend/.env file. Also ensure to fill in the GOOGLE_LOCATION variable in this file.

The last step is to follow instructions at this [link](https://support.google.com/cloud/answer/6158849?hl=en) to create a OAuth Client ID. Once obtained, put this Client ID in the /frontend/.env file.


To run the program run the following terminal command and access the app on localhost:3000 on Google Chrome.
```bash
docker-compose up --build
```

