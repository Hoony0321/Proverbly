# Step 1: Build Stage
FROM gradle:jdk17-corretto-al2023 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle bootJar --no-daemon

# Step 2: Runtime Stage
FROM bellsoft/liberica-openjdk-alpine-musl:17 AS runtime
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
