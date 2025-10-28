#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PORT=5001

echo -e "${YELLOW}🔍 Checking if port ${PORT} is in use...${NC}"

# Check if port is in use
if lsof -ti:${PORT} > /dev/null 2>&1; then
    echo -e "${RED}⚠️  Port ${PORT} is already in use!${NC}"
    echo -e "${YELLOW}🔧 Killing process on port ${PORT}...${NC}"
    lsof -ti:${PORT} | xargs kill -9 2>/dev/null
    sleep 1
    echo -e "${GREEN}✅ Port ${PORT} is now free!${NC}"
else
    echo -e "${GREEN}✅ Port ${PORT} is free!${NC}"
fi

echo -e "${GREEN}🚀 Starting server...${NC}\n"

# Start the server
node server.js
