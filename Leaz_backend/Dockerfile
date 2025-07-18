# Use the official Eclipse Temurin image for Java 11
FROM eclipse-temurin:11-jdk-focal

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Run the Gradle build to compile the application and create the JAR file
# The -x test flag skips running tests, which speeds up the build
RUN ./gradlew build -x test

# Set the entrypoint to run the Java application
ENTRYPOINT ["java", "-jar", "build/libs/Leaz_backend-0.0.1-SNAPSHOT.jar"]
