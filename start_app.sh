#!/bin/bash

echo "Starting MySQL server..."
"C:/xampp/mysql/bin/mysqld.exe" --console &  # Start MySQL in the background

sleep 5  # Wait for MySQL to initialize

echo "Starting Spring Boot application..."

# Navigate to the correct folder where mvnw is located
cd "C:/Users/dasantha/Desktop/FINAL_CLONE/java-budgetcontrol/employaa" || {
    echo "Error: Project folder not found!"
    exit 1
}

# Check if mvnw exists before running
if [ -f "./mvnw" ]; then
    chmod +x mvnw  # Ensure it's executable
    ./mvnw spring-boot:run
else
    echo "Error: mvnw not found in $(pwd)!"
    exit 1
fi
