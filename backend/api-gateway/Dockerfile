# syntax=docker/dockerfile:1

# ---- Build stage: Maven + JDK 17 ----
# The official Maven image is used instead of ./mvnw, because the mvnw file
# in this folder is not a valid Maven wrapper script.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml ./
COPY src src
# BuildKit cache mount keeps downloaded dependencies between builds
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests clean package

# ---- Runtime stage: slim JRE 17, only the jar, non-root user ----
FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
USER app

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]