FROM python:3.12 AS base
ENV POETRY_HOME=/opt/poetry
ENV PATH="/opt/poetry/bin:${PATH}"

RUN mkdir -p /opt/poetry/project /opt/poetry/bin
RUN curl -sSL https://install.python-poetry.org | python -

COPY pyproject.toml poetry*.lock README.md /opt/poetry/project/
RUN \
    cd /opt/poetry/project && \
    poetry config virtualenvs.create false && \
    if [ ! -f poetry.lock ]; then poetry lock; fi && \
    poetry install --no-root && \
    poetry env info

RUN useradd -ms /bin/bash developer
USER developer
WORKDIR /home/developer
#ENV PATH="/home/developer/.poetry/bin:/home/developer/.local/bin:${PATH}"

#COPY --chown=developer --chmod=755 pyproject.toml poetry*.lock README.md ./
#RUN curl -sSL https://install.python-poetry.org | python -
#RUN \
#    poetry config virtualenvs.create false && \
#    if [ ! -f poetry.lock ]; then poetry lock; fi && \
#    poetry install --no-root && \
#    poetry env info && \
#    mkdir -p .poetry && \
#    ln -s "$(poetry env info --path)/bin" "${HOME}/.poetry/bin"

FROM base as dev
USER root
RUN cd /opt/poetry/project && poetry install --no-root --with build,lint,test
USER developer
