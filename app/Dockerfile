FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY ./ .
# Run Gradle build and redirect output to a log file
RUN gradle --no-daemon build -x test --info

# Main stage
FROM amazoncorretto:21-alpine3.18
VOLUME /tmp

RUN apk update && apk add --no-cache

EXPOSE 8080
COPY --from=builder /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-Dspring.profiles.active=${ENV}", "-Xms256m", "-Xmx3072m", "-jar", "app.jar"]