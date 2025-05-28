#!/bin/bash

# Configuration - Replace these values
TARGET_USER="username"  # Username on target device
TARGET_HOST="192.168.1.x"  # IP or hostname of target device
TARGET_PATH="/path/to/destination"  # Destination path

# Source path (current project)
SOURCE_PATH="$(pwd)"

# Create the transfer command
TRANSFER_CMD="rsync -avz --progress --exclude node_modules --exclude .git \"$SOURCE_PATH\" $TARGET_USER@$TARGET_HOST:$TARGET_PATH"

echo "This will transfer your project to: $TARGET_USER@$TARGET_HOST:$TARGET_PATH"
echo "Transfer command: $TRANSFER_CMD"
echo ""
echo "To execute, edit this script first to set the correct TARGET_USER, TARGET_HOST, and TARGET_PATH values,"
echo "then run it again."
echo ""
echo "After transfer, run \"npm install\" in the project directory on the target device."

# Uncomment the following line after configuring the variables above
# eval $TRANSFER_CMD 