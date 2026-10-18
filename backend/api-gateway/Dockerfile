# syntax=docker/dockerfile:1

# ---- Build stage: JDK 17 + Maven wrapper ----
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace

COPY mvnw pom.xml ./
COPY .mvn .mvn
# Windows checkouts can have CRLF line endings or a missing executable bit
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

COPY src src
# BuildKit cache mount keeps downloaded dependencies between builds
RUN --mount=type=cache,target=/root/.m2 ./mvnw -B -DskipTests clean package

# ---- Runtime stage: slim JRE 17, only the jar, non-root user ----
FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
USER app

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
EXPOSE 8082
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]