FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java",
  "-Xms64m",
  "-Xmx256m",
  "-XX:MaxMetaspaceSize=128m",
  "-XX:+UseSerialGC",
  "-XX:+OptimizeStringConcat",
  "-jar",
  "app.jar"
]