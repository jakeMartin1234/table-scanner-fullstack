#!/bin/bash

#cp backend/sample.env backend/.env
#
if command -v python &> /dev/null; then
    PYTHON=python
elif command -v python3 &> /dev/null; then
    PYTHON=python3
else
    echo "Error: Python is not installed." >&2
    exit 1
fi

## Run the Python script using the correct Python executable
#$PYTHON create_env.py
#
gcloud projects create table-scanner-1 --name="Table Scanner"
gcloud config set project PROJECT_ID
export PROJECT_ID=$(gcloud config get-value core/project)
export LOCATION=us
export SA_NAME="document-ai-service-account"
gcloud iam service-accounts create $SA_NAME --display-name $SA_NAME
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
--member="serviceAccount:$SA_NAME@${PROJECT_ID}.iam.gserviceaccount.com" \
--role="roles/documentai.apiUser"
gcloud iam service-accounts keys create $PWD/backend/key.json \
--iam-account  $SA_NAME@${PROJECT_ID}.iam.gserviceaccount.com



curl -X POST \
    -o processorDetails.json \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @request.json \
    "https://${LOCATION}-documentai.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/processors"

$PYTHON create_env.py

#gcloud projects create table-scanner-1 --name="Table Scanner"
#gcloud config set project PROJECT_ID
#gcloud iam service-accounts create table-scanner-account --display-name="My Service Account"