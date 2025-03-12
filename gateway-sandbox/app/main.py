import base64
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ed25519
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import hashlib
from jose import jws
import json


app = FastAPI()

dummy_metadata = json.dumps({"hello": "world"}, sort_keys=True)
#
# with open("keys/public_key.pem", "rb") as public_key_file:
#     public_key = public_key_file.read()


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

@app.get("/")
def read_root():
    return JSONResponse(content=json_payload)
