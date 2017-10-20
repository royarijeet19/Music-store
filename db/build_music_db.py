from __future__ import print_function
import sys, pygn, json


clientID = '2104584822-2DA6486B91DF135895A29CC1A6A3A6E7' # Enter your Client ID from developer.gracenote.com here
userID = '49075496506642242-F63F92D359342233D28026EFFADCE3A0' # Get a User ID from pygn.register() - Only register once per end-user
result = pygn.search(clientID=clientID, userID=userID, artist='Dylan, Bob', track='Like A Rolling Stone')
print(type(result))
print(json.dumps(result, sort_keys=True, indent=2))


print("Track:\t",result["track_title"])
print("Album:\t",result["album_title"])
print("Artist:\t",result["album_artist_name"])
print("Track no:\t",result["track_number"])
print("Genre:\t",", ".join([y["TEXT"] for x,y in result["genre"].iteritems()]))
print("Mood:\t",", ".join([y["TEXT"] for x,y in result["mood"].iteritems()]))
print("Year:\t",result["album_year"])
print("Art:\t",result["album_art_url"])
