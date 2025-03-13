import base64
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives import serialization
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import json
import os
import dns.resolver
import requests


app = FastAPI()


def read_peers_file(peer_names_file):
    with open(peer_names_file, "r") as peers_file:
        peers = [line.rstrip() for line in peers_file]
    return peers

def retrieve_metadata_from_peer(peer_address):
    api_response = requests.get(peer_address)
    json = api_response.json()

    answers = dns.resolver.resolve(json["key"], 'TXT')
    for answer in answers:
        public_key_data = f"-----BEGIN PUBLIC KEY-----\n{str(answer)[1:-1]}\n-----END PUBLIC KEY-----"
        signature = base64.b64decode(json["signature"])
        key = load_pem_public_key(public_key_data.encode())
        key.verify(signature, json["data"].encode()) # will raise InvalidSignature error if not verified
        print(f"Data signature verified with key {json["key"]}")
        return json


@app.get("/retrieve_metadata")
def retrieve_data():
    peers = read_peers_file(os.path.join(os.path.dirname(os.path.realpath(__file__)), "peers.txt"))
    for peer in peers:
        data = retrieve_metadata_from_peer(peer)
        filepath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "data.json")
        data_file = open(filepath, "w")
        data_file.write(json.dumps(data, sort_keys=True))
        data_file.close()


@app.get("/")
def read_root():
    dummy_metadata = json.dumps({"hello": "world"}, sort_keys=True)

    with open("keys/private_key.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )

    signed = private_key.sign(dummy_metadata.encode())

    # verify signature
    public_key = private_key.public_key()
    check = public_key.verify(signed, dummy_metadata.encode())

    # encode signature so it can be returned as part of the JSON response
    jsonable_signature = jsonable_encoder(signed, custom_encoder={
        bytes: lambda v: base64.b64encode(v).decode('utf-8')})

    # verify decoded signature
    decoded = base64.b64decode(jsonable_signature)
    check_2 = public_key.verify(decoded, dummy_metadata.encode())

    json_payload = {
        "author": "bodc.ac.uk",
        "key": "bd20c3bc-c2d5-4f98-bbec-413bd63cedd4.keys.bodc.uk",
        "data": dummy_metadata,
        "signature": jsonable_signature
    }
    return JSONResponse(content=json_payload)
