FROM cgr.dev/chainguard/jdk AS base

USER root

FROM base AS builder

WORKDIR /build

COPY . .

RUN ./mvnw clean package

FROM base AS runtime

WORKDIR /app

RUN <<EOF
set -e
addgroup --system --gid 1001 gcontainer
adduser --system --uid 1001 -G gcontainer springjava
EOF

COPY --from=builder --chown=springjava --chmod=750 /build/target/*.jar app.jar
COPY --chown=springjava --chmod=750 scripts/run.sh run.sh

EXPOSE 8080

USER springjava

ENTRYPOINT ["/app/run.sh"]