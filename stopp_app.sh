#!/bin/bash

echo "Stopping Spring Boot application..."
# Find the Spring Boot process and kill it
SPRING_PID=$(pgrep -f 'java.*spring-boot')
if [ -n "$SPRING_PID" ]; then
    kill "$SPRING_PID"
    echo "Spring Boot application stopped."
else
    echo "No Spring Boot application running."
fi

echo "Stopping MySQL server..."
# Find and kill MySQL process
MYSQL_PID=$(pgrep -f 'mysqld')
if [ -n "$MYSQL_PID" ]; then
    kill "$MYSQL_PID"
    echo "MySQL server stopped."
else
    echo "No MySQL server running."
fi

