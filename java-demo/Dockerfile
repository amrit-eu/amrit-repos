FROM eclipse-temurin:17.0.10_7-jre-jammy AS runtime

WORKDIR /opt/app

RUN <<EOF
set -e
addgroup --gid 1001 java
useradd --uid 1001 --gid 1001 -m java
EOF

ARG JAR_FILE=target/*.jar
COPY --chown=java --chmod=750 ${JAR_FILE} app.jar
COPY --chown=java --chmod=750 scripts/run.sh run.sh

EXPOSE 8080

USER java

ENTRYPOINT ["/opt/app/run.sh"]