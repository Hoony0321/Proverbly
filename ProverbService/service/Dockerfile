# Step 1: Build Stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle bootJar --no-daemon

# Step 2: Runtime Stage
FROM eclipse-temurin:17-jre-focal AS runtime
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

