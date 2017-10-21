import sys, pygn, json
from pprint import pprint
from random import randint as rint
from time import sleep
import csv

"""

"""

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

def track_price():
    """
    Fetches price of song in dollar.cent format
    randomly.

    total cost = .99 cent + 2*(random(0, 100)/100)
    """
    n = 0.99+2*(rint(0,100)/100.0)
    return str(n)


def fix_art(art_url):
    """
    TODO: fetch art in high res
    old url: http://akamai-b.cdn.cddbp.net/cds/2.0/cover/C7D4/F9A2/FBAC/1752_medium_front.jpg?cid=2104584822
    new url: http://akamai-b.cdn.cddbp.net/cds/2.0/cover/C7D4/F9A2/FBAC/1752_large_front.jpg
    """
    art_url = art_url.replace('medium_','large_')
    art_url = art_url.split('?')[0]
    
    return art_url
    
def non_unicode(text):
    text = ''.join([i if ord(i) < 128 else ' ' for i in text])
    text = text.replace("'",'')
    return text

def fetch_meta(artist, track):
    """
    Fetch metadata for artist and track:
    track, album, artist, track_no, genre, mood, year, art, duration    
    """
    
    clientID = '2104584822-2DA6486B91DF135895A29CC1A6A3A6E7'
    userID = '49075496506642242-F63F92D359342233D28026EFFADCE3A0'
    meta = False
    try:
        result = pygn.search(clientID=clientID,
                             userID=userID,
                             artist=artist,
                             track=track)
    except:
        result = False
        
    
    if result:
        meta = {
            "track" : non_unicode(result["track_title"]),
            "album" : non_unicode(result["album_title"]),
            "artist" : non_unicode(result["album_artist_name"]),
            "track_no" : result["track_number"],
            "genre" : [y["TEXT"] for x,y in result["genre"].iteritems()],
            "mood" : [y["TEXT"] for x,y in result["mood"].iteritems()],
            "year" : result["album_year"],
            "art" : fix_art(result["album_art_url"]),
            "length": track_length(),
            "price": track_price()
        }
    return meta


def download_metadata(test=False):
    """
    Downloads metadata for songs in some_music_to_insert.csv
    and stores in metadata.json
    """
    
    meta = []
    count = 0
    meta_file = "metadata.json"
    with open('some_music_to_insert.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for track,artist in spamreader:
            track_meta = fetch_meta(artist,track)
            count+=1
            if not track_meta:
                continue
            meta.append(track_meta)
            print ""
            print count,'-',artist,'-' ,track
            print track_meta
            sleep(1)
            if test and (rint(0,200)<5):
                break
                

    with open(meta_file, 'w') as w:
        json.dump(meta, w, indent=2)

if __name__ == '__main__':
    download_metadata(test=False)
    print "done!"
        
