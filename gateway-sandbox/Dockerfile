FROM docker-repo.bodc.me/bodc/python:latest

#Add metadata
LABEL "description"="Testing JWS for AMRIT"
LABEL "author"="British Oceanographic Data Centre (BODC)"
LABEL "base image"="Base python Image"

RUN pip3 install --upgrade pip

# switch working directory
WORKDIR /app

# Add demo app and copy contents to image
COPY . .

# copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /requirements.txt

# install the dependencies and packages in the requirements file
RUN pip install --no-cache-dir -r requirements.txt

