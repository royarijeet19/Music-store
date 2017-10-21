import sys, pygn, json
from pprint import pprint
from random import randint as rint
from time import sleep
import csv

def track_length():
    """
    Fetches length/duration of song in MM:SS format
    randomly.

    total seconds = 2 min + random(0, 5 minutes)
    """
    n = 120+rint(0,300)
    minutes= str(n/60)
    seconds = str(n%60)
    return "{0}:{1}".format(minutes,seconds)


def fix_art(art_url):
    """
    TODO: fetch art in high res
    old url: http://akamai-b.cdn.cddbp.net/cds/2.0/cover/C7D4/F9A2/FBAC/1752_medium_front.jpg?cid=2104584822
    new url: http://akamai-b.cdn.cddbp.net/cds/2.0/cover/C7D4/F9A2/FBAC/1752_large_front.jpg
    """
    art_url = art_url.replace('medium_','large_')
    art_url = art_url.split('?')[0]
    
    return art_url
    
    

def fetch_meta(artist, track):
    """
    Fetch metadata for artist and track:
    track, album, artist, track_no, genre, mood, year, art, duration    
    """
    
    clientID = '2104584822-2DA6486B91DF135895A29CC1A6A3A6E7' # Enter your Client ID from developer.gracenote.com here
    userID = '49075496506642242-F63F92D359342233D28026EFFADCE3A0' # Get a User ID from pygn.register() - Only register once per end-user
    result = pygn.search(clientID=clientID, userID=userID, artist=artist, track=track)
    # print(type(result))
    # print(json.dumps(result, sort_keys:True, indent:2))
    
    meta = {
        "track" : result["track_title"],
        "album" : result["album_title"],
        "artist" : result["album_artist_name"],
        "track_no" : result["track_number"],
        "genre" : ", ".join([y["TEXT"] for x,y in result["genre"].iteritems()]),
        "mood" : ", ".join([y["TEXT"] for x,y in result["mood"].iteritems()]),
        "year" : result["album_year"],
        "art" : fix_art(result["album_art_url"]),
        "duration": track_length()
    }
    return meta

# pprint(fetch_meta("Coldplay", "scientist"))

def download_metadata():
    meta = []
    meta_file = "metadata.json"
    with open('some_music_to_insert.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for track,artist in spamreader:
            track_meta = fetch_meta(artist,track)
            meta.append(track_meta)
            print ""
            print artist,'-' ,track
            print track_meta
            sleep(.1)

    with open(meta_file, 'w') as w:
        json.dump(meta, w)

if __name__ == '__main__':
    download_metadata()
    print "done!"
        
