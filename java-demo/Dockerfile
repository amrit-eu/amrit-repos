FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

COPY ./.mvn ./.mvn
COPY ./mvnw ./mvnw
COPY ./pom.xml ./pom.xml
COPY ./src ./src

RUN ./mvnw clean package

FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

RUN <<EOF
set -e
addgroup --system --gid 1001 gcontainer
adduser --system --uid 1001 -G gcontainer spring
EOF

COPY --from=builder --chown=root:gcontainer --chmod=750 /build/target/*.jar app.jar
COPY --chown=root:gcontainer --chmod=750 scripts/run.sh run.sh

EXPOSE 8080

USER spring

ENTRYPOINT ["/app/run.sh"]