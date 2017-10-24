# Node backend calls

## Sign up page: sign up new user
*frontend:* Check if all mandatory fields are filled, check for strong pwd. Hash pwd.

*backend:* store uname, pwd, emailid, address in user table.

If uname or email address already exists return 400 else return 201

**input:**
```
fail={
    "uname":"user",
    "pwd":"123",
    "email":"test@test.com",
    "address":"street"
}
pass={
    "uname":"user1",
    "pwd":"123",
    "email":"test@test.com",
    "address":"street"
}
```
**response:**
```
fail={"status":400}
pass={"status":201}
```

## Login page: authenticate user
*frontend:* hash pwd.\\
*backend:* check if both uname and pwd match from user table.\\
**input:**
```
{
    "uname":"user",
    "pwd":"123"
}
```
**response:**
```
fail={"status":401}
pass={"status":200}
```

## Home page: search track
For now, only use search on track. Implement searching on other fields later\\
**input:**
```
{
    "search_track":"what",
}
```
**response:**
```
response=[
    {
        "track": "What Lovers Do (Featuring SZA)", 
        "track_id": "606d2f43781119993f90f1f4cc522871",
        "price": "1.35", 
        "year": "2017", 
        "genre": [
            "Pop", 
            "Adult Alternative Pop", 
            "Western Pop"
        ], 
        "album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/F764/6709/6E9C/7F07_large_front.jpg", 
        "album": "What Lovers Do (Featuring SZA)", 
        "artist": "Maroon 5", 
        "length": "2:47", 
        "track_no": "1"
    }, 
    {
        "track": "Look What You Made Me Do", 
        "track_id": "e3d64c16949ca20548118cf05798de16",
        "price": "1.43", 
        "year": "2017", 
        "genre": [
            "Pop", 
            "Adult Alternative Pop", 
            "Western Pop"
        ], 
        "album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/FB22/0DAA/4BBD/E903_large_front.jpg", 
        "album": "Look What You Made Me Do [Single]", 
        "artist": "Taylor Swift", 
        "length": "3:1", 
        "track_no": "1"
    }, 
    {
        "track": "What Ifs", 
        "track_id": "1106f8ab3ebfa9318c5da72fb92e8b14",
        "price": "1.89", 
        "year": "2016", 
        "genre": [
            "Traditional", 
            "Contemporary Country", 
            "Country"
        ], 
        "album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/3320/523D/AE98/5F05_large_front.jpg", 
        "album": "Kane Brown", 
        "artist": "Kane Brown", 
        "length": "4:17", 
        "track_no": "2"
    }, 
    {
        "track": "What About Us", 
        "track_id": "d8cfb2bc3a748a4fa66c2aab2944147b",
        "price": "2.37", 
        "year": "2017", 
        "genre": [
            "Pop", 
            "Dance Pop", 
            "Western Pop"
        ], 
        "album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/727F/19DD/3B84/A3AB_large_front.jpg", 
        "album": "Beautiful Trauma", 
        "artist": "P!nk", 
        "length": "3:33", 
        "track_no": "4"
    }, 
    {
        "track": "Whatever It Takes", 
        "track_id": "85408490bc6677a1a0212849f7361f51",
        "price": "1.95", 
        "year": "2017", 
        "genre": [
            "Alternative & Punk", 
            "Indie Pop", 
            "Indie Rock"
        ], 
        "album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/7158/3EFD/1716/4874_large_front.jpg", 
        "album": "Evolve", 
        "artist": "Imagine Dragons", 
        "length": "2:11", 
        "track_no": "2"
    }
]
```

## Search page: add to cart
*frontend:* extract track_id from card class/div\\
*backend:* Add track_id into cart table with key as username. Do not add entry if already exists\\
use session variables to determine username.\\
**input:**
```
{
    "track_id":"e3d64c16949ca20548118cf05798de16"
}
```
**response:**
```
fail={"status":500}
pass={"status":200}
```

## Cart page: fetch cart
*backend:* Fetch all entries from cart. Get uname from session variables.\\
**type:** GET
**response:**
```
same as search
```

## cart page: delete from cart
*frontend:* extract track_id from card class/div. remove card after response\\
*backend:* remove row from cart table with key as username and value as track_id.\\
use session variables to determine username.
**input:**
```
{
    "track_id":"e3d64c16949ca20548118cf05798de16"
}
```
**response:**
```
fail={"status":500}
pass={"status":200}
```
## cart page: purchase
*frontend:* remove all cards on cart. display message purchase complete.\\
*backend:* move items from cart table to purchase table.\\
**type:**GET\\
**response:**
```
response=[{
	"timestamp": [{
			"track": "What Lovers Do (Featuring SZA)",
			"track_id": "606d2f43781119993f90f1f4cc522871",
			"price": "1.35",
			"year": "2017",
			"genre": [
				"Pop",
				"Adult Alternative Pop",
				"Western Pop"
			],
			"album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/F764/6709/6E9C/7F07_large_front.jpg",
			"album": "What Lovers Do (Featuring SZA)",
			"artist": "Maroon 5",
			"length": "2:47",
			"track_no": "1"
		},
		{
			"track": "Look What You Made Me Do",
			"track_id": "e3d64c16949ca20548118cf05798de16",
			"price": "1.43",
			"year": "2017",
			"genre": [
				"Pop",
				"Adult Alternative Pop",
				"Western Pop"
			],
			"album_art": "http://akamai-b.cdn.cddbp.net/cds/2.0/cover/FB22/0DAA/4BBD/E903_large_front.jpg",
			"album": "Look What You Made Me Do [Single]",
			"artist": "Taylor Swift",
			"length": "3:1",
			"track_no": "1"
		}
	]
}]
```