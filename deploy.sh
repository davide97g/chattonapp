#!/bin/bash

# Variables
DIST_PATH="/Users/davideghiotto/Desktop/projects/chattonapp/apps"
SECRETS_FILE="/Users/davideghiotto/Desktop/projects/chattonapp/secrets.txt"
REMOTE_USER="davide"
REMOTE_HOST="raspberrypi"
REMOTE_PATH="/home/davide/chattonapp"

# Read password from secrets file
if [ ! -f "$SECRETS_FILE" ]; then
    echo "Secrets file not found: $SECRETS_FILE"
    exit 1
fi

PASSWORD=$(cat "$SECRETS_FILE")

# Deploy using sshpass
if ! command -v sshpass &> /dev/null; then
    echo "sshpass is not installed. Please install it and try again."
    exit 1
fi

sshpass -p "$PASSWORD" scp -r "$DIST_PATH/backend/dist" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend_dist"
sshpass -p "$PASSWORD" scp -r "$DIST_PATH/frontend/dist" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend_dist"

if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed."
    exit 1
fi