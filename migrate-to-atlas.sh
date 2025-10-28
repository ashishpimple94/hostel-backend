#!/bin/bash

# MongoDB Data Migration Script
# Migrates local MongoDB data to MongoDB Atlas

echo "🚀 MongoDB Atlas Migration Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
LOCAL_URI="mongodb://localhost:27017/hostel_management"
BACKUP_DIR="/Users/ashishpimple/Desktop/hostel_backup"

echo -e "${YELLOW}📋 Pre-requisites:${NC}"
echo "1. MongoDB Atlas account created"
echo "2. Cluster created and running"
echo "3. Database user created"
echo "4. IP whitelist configured (0.0.0.0/0)"
echo ""

read -p "Have you completed all pre-requisites? (y/n): " prereq
if [[ $prereq != "y" ]]; then
    echo -e "${RED}❌ Please complete prerequisites first!${NC}"
    echo "Visit: https://www.mongodb.com/cloud/atlas"
    exit 1
fi

echo ""
echo -e "${BLUE}🔑 Enter your MongoDB Atlas connection string:${NC}"
echo "Example: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/hostel_management"
read -p "Atlas URI: " ATLAS_URI

if [[ -z "$ATLAS_URI" ]]; then
    echo -e "${RED}❌ Atlas URI cannot be empty!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📦 Step 1: Exporting local data...${NC}"

# Check if mongodump exists
if ! command -v mongodump &> /dev/null; then
    echo -e "${RED}❌ mongodump not found!${NC}"
    echo -e "${YELLOW}Install with: brew install mongodb-database-tools${NC}"
    exit 1
fi

# Export data
mongodump --uri="$LOCAL_URI" --out="$BACKUP_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local data exported successfully!${NC}"
    echo "   Location: $BACKUP_DIR"
else
    echo -e "${RED}❌ Export failed!${NC}"
    echo "   Make sure local MongoDB is running"
    exit 1
fi

echo ""
echo -e "${YELLOW}📤 Step 2: Importing to Atlas...${NC}"

# Check if mongorestore exists
if ! command -v mongorestore &> /dev/null; then
    echo -e "${RED}❌ mongorestore not found!${NC}"
    echo -e "${YELLOW}Install with: brew install mongodb-database-tools${NC}"
    exit 1
fi

# Import data
mongorestore --uri="$ATLAS_URI" "$BACKUP_DIR/hostel_management"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Data successfully migrated to Atlas!${NC}"
    echo ""
    echo -e "${BLUE}📊 Next Steps:${NC}"
    echo "1. Update backend/.env file:"
    echo "   MONGODB_URI=$ATLAS_URI"
    echo ""
    echo "2. Test connection:"
    echo "   cd backend && node server.js"
    echo ""
    echo "3. Verify data in Atlas Dashboard:"
    echo "   https://cloud.mongodb.com"
    echo ""
    echo -e "${GREEN}🎉 Migration Complete!${NC}"
else
    echo -e "${RED}❌ Import failed!${NC}"
    echo "Check your Atlas connection string and network access"
    exit 1
fi

# Ask to update .env
echo ""
read -p "Do you want to update backend/.env with Atlas URI? (y/n): " update_env

if [[ $update_env == "y" ]]; then
    BACKEND_DIR="/Users/ashishpimple/Desktop/Hostel Manage/backend"
    ENV_FILE="$BACKEND_DIR/.env"
    
    if [ -f "$ENV_FILE" ]; then
        # Backup existing .env
        cp "$ENV_FILE" "$ENV_FILE.backup"
        echo -e "${YELLOW}📝 Backed up .env to .env.backup${NC}"
        
        # Update MONGODB_URI
        if grep -q "MONGODB_URI=" "$ENV_FILE"; then
            sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$ATLAS_URI|" "$ENV_FILE"
        else
            echo "MONGODB_URI=$ATLAS_URI" >> "$ENV_FILE"
        fi
        
        echo -e "${GREEN}✅ .env file updated!${NC}"
    else
        echo -e "${YELLOW}⚠️  .env file not found${NC}"
        echo "Please create it manually with:"
        echo "MONGODB_URI=$ATLAS_URI"
    fi
fi

echo ""
echo -e "${GREEN}✨ All done! Your data is now on MongoDB Atlas.${NC}"
