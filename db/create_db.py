"""
This script reads data from metadata.json and dumps it into sql database

NOTE:Create a database called musicstore before running this script
----
"""

import MySQLdb
import json
from pprint import pprint
import hashlib
from time import sleep

db = MySQLdb.connect(host="localhost",  
                     user="root",  
                     passwd="root",
                     db="musicstore")
cur = db.cursor()

# Drop tables
cur.execute("drop table if exists genre")
cur.execute("drop table if exists mood")
cur.execute("drop table if exists track")
cur.execute("drop table if exists album")
cur.execute("drop table if exists purchase")
cur.execute("drop table if exists user")
cur.execute("drop table if exists cart")

# Create tables
#---------------


# Music tables: album, track, mood, genre
cur.execute("create table album(album_id char(32), album_name char(50), artist char(30), year int, album_art char(80), artist_art char(80), primary key (album_id))")
cur.execute("create table track(track_id char(32), album_id char(32),track_name char(20), track_no int(3), length char(5), price char(5), primary key (track_id), foreign key (album_id) references album(album_id))")
cur.execute("create table mood(track_id char(32), mood char(50), foreign key (track_id) references track(track_id))")
cur.execute("create table genre(track_id char(32), genre char(50), foreign key (track_id) references track(track_id))")

# User tables: user, purchase, cart
cur.execute("create table user(uname char(10), pwd char(128), admin bit, email char(32), address varchar(100), primary key (uname));")
cur.execute("create table purchase(purchase_id char(32),uname char(10), date datetime, track_id char(32), foreign key (uname) references user(uname));")
cur.execute("create table cart(uname char(10), track_id char(32), primary key(uname, track_id), foreign key (uname) references user(uname));")


# Insert some default user data
cur.execute("insert into user values('admin', '92f39f7f2a869838cd5085e6f17fc82109bcf98cd62a47cbc379e38de80bbc0213a23cee6e4a13de6caae0add8a390272d6f0883c274320b1ff60dbcfc6dd750', 1, 'admin@admin.com', 'richardson');");
cur.execute("insert into user values('user', '5703bdfbd16ef47f929ddbf4785d4486e385049f627233efb359b094add552921033f95f6e89453ec81c5d502f3f477de1e9c8948c61468a6ed9d9a615bde126', 0, 'user@user.com', 'richardson');");
db.commit()


def mood_insert(track_id, moods):
    mood_fmt = "insert into mood (track_id, mood) values ('{0}','{1}');"
    for mood in moods:
        mood=mood.lower().replace("'",'')
        insert_str = mood_fmt.format(track_id, mood)
        print (insert_str)
        cur.execute(insert_str)
    
def genre_insert(track_id, genres):
    genre_fmt = "insert into genre (track_id, genre) values ('{0}','{1}');"
    for genre in genres:
        genre=genre.lower().replace("'",'')
        insert_str = genre_fmt.format(track_id, genre)
        print (insert_str)
        cur.execute(insert_str)
    
def album_insert(**kwargs):
    exists = cur.execute("select * from album where album_id='{0}'".format(kwargs['album_id']))
    if exists:
        return
    album_fmt = "insert into album (album_id, album_name, artist, year, album_art, artist_art) values ('{album_id}','{album_name}','{artist}','{year}','{album_art}','{artist_art}');"
    kwargs['album_name']=kwargs['album_name'].replace("'",'')
    insert_str = album_fmt.format(**kwargs)
    print (insert_str)
    cur.execute(insert_str)
    
def track_insert(**kwargs):
    # truncate track
    kwargs['track_name']=kwargs['track_name'].split("(")[0].strip()
    track_fmt = "insert into track (track_id, album_id, track_name, track_no, length, price) values('{track_id}', '{album_id}', '{track_name}', '{track_no}', '{length}', '{price}');"
    kwargs['track_name']=kwargs['track_name'].replace("'",'')
    insert_str = track_fmt.format(**kwargs)
    print (insert_str)
    cur.execute(insert_str)
    

# populate tables
with open('metadata.json') as r:
    meta = json.load(r)
    inserted = []
    for el in meta:
        print ("")

        # todo: remove 3 lines later
        el['album'] = ''.join([i if ord(i) < 128 else ' ' for i in el['album']]).replace("'",'')
        el['artist'] = ''.join([i if ord(i) < 128 else ' ' for i in el['artist']]).replace("'",'')
        el['track'] = ''.join([i if ord(i) < 128 else ' ' for i in el['track']]).replace("'",'')

        pprint(el)
        track_id = hashlib.md5(el['track']+el['artist']).hexdigest()
        album_id = hashlib.md5(el['album']+el['artist']).hexdigest()
        print ("track_id=", track_id)
        print ("album_id=", album_id)
        if track_id in inserted:
            continue
        album_insert(album_id=album_id,
                     album_name=el['album'],
                     artist=el['artist'],
                     year=el['year'],
                     album_art=el['album_art'],
                     artist_art=el['artist_art'])
        track_insert(track_id=track_id,
                     album_id=album_id,
                     track_name=el['track'],
                     track_no=el['track_no'],
                     length=el['length'],
                     price=el['price'])
        mood_insert(track_id, el['mood'])
        genre_insert(track_id, el['genre'])
        inserted.append(track_id)
        db.commit()
        
print ("done!")
