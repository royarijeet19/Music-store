import json,sys
import hashlib
import pymongo
from pprint import pprint

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['music-store']
posts = db.tracks
posts.remove()

with open('metadata.json') as f:
    data = json.load(f)

for el in data:
    track_id = hashlib.md5(el['track']+el['artist']).hexdigest()
    album_id = hashlib.md5(el['album']+el['artist']).hexdigest()
    el['track_id'] = track_id
    el['album_id'] = album_id
    print el['track']
    posts.insert_one(el)
    
