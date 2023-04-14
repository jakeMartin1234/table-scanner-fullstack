import os
import sys
import json

# Set the file path and the key-value pairs
file_path = "./backend/.env"
f = open('processorDetails.json')
data = json.load(f)
env_vars = {
    "GOOGLE_APPLICATION_CREDENTIALS": "./key.json",
    "GOOGLE_PROCESSOR_LOCATION": data['name']

}

# Create the new .env file
with open(file_path, "w") as f:
    for key, value in env_vars.items():
        f.write(f"{key}={value}\n")
os.remove('processorDetails.json')

print(f"Done! The new .env file has been created at {file_path}.")
