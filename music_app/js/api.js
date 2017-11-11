var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "musicstore"
});

// Fetches one track randomly
router.get('/fetchOne', function(req,res){
    console.log('GET: /api/fetchOne');
    
    con.query("select * from track order by rand() limit 1", function (err, result, fields) {
	if (err) throw err;
	data = JSON.parse(JSON.stringify(result));
	res.send(data[0]);
    });
});

// Fetche requested track
// input: { track_id: '549e1ffd66ac099ccadbf6f61729897b' }
router.post('/fetch', function(req,res){
    console.log('POST: /db/track/fetch');
    
    var data = req.body;
    console.log(data);
    var query = "select * from track where track_id='"+data.track_id+"'";
    con.query(query, function (err, result, fields) {
    if (err) throw err;
    data = JSON.parse(JSON.stringify(result));
    res.send(data[0]);
    });
});

//signup user
router.post('/signup', function(req,res){
    console.log('POST: /signup');
    console.log(JSON.stringify(req.body));

    var uname = req.body.uname;
    var pwd = req.body.pwd;
    var email = req.body.email;

    var check_uname_query = "select * from user where uname = '"+uname+"'";
    var check_email_query = "select * from user where email = '"+email+"'";


    var user_exists = false;
    var email_exists = false;
    con.query(check_uname_query, function (err, result, fields) {
        if (err) throw err;
        data = JSON.parse(JSON.stringify(result));
        if(data != null) user_exists = true;
    });

    con.query(check_email_query, function (err, result, fields) {
        if (err) throw err;
        data = JSON.parse(JSON.stringify(result));
        if(data != null) email_exists = true;
    });

    if(user_exists && email_exists) {
        res.status(400).send('Username and email exists.');
    }
    else if(user_exists) {
        res.status(400).send('Username exists.');
    }
    else if(email_exists) {
        res.status(400).send('Email exists.');
    }
    else {
    	    req.session.uname=uname;
            var insert_query = "insert into user values('"+uname+"', '"+pwd+"', 0, '"+email+"', null);";
            con.query(insert_query, function (err, result, fields) {
                if (err) throw err;
                data = JSON.parse(JSON.stringify(result));
                res.status(201).send('Signup successful');
            });

    }
});

// Authenticate user
// input: {"uname":"test","pwd":"test123"}
router.post('/login', function(req,res){
    console.log('POST: /login');
    console.log(JSON.stringify(req.body));

    var uname = req.body.uname;
    var pwd = req.body.pwd;
    if (uname){
        req.session.uname = uname;
        res.send('authorized as '+req.session.uname);
    }else{
        res.send('home page: nothing to see here');
    }
});

// Checks if the user is authenticated
router.get('/login/auth-status', function(req,res){
    console.log('GET: /login/auth-status');

    if(!req.session.uname){
        console.log("unauthorized");
        res.send("unauthorized");
    }else{
        console.log("logged in");
        res.send("logged in");
    }
});


//----------------------------
// Add item to user Cart
// input: {"track_id":"549e1ffd66ac099ccadbf6f61729897b"}
router.post('/add_to_cart', function(req,res){
    console.log('POST: /add_to_cart');
    console.log(JSON.stringify(req.body));

    var uname = req.body.uname;
    var track_id = req.body.track_id;
    var add_to_cart_query = "insert into cart (uname, track_id) values ('"+uname+"', '"+track_id+"');"
    con.query(add_to_cart_query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        res.send(data[0]);
    });
});

// Return the type of user
// output: {"user_type": x}
// where x is any of "admin" "user" "guest"
router.get('/user_type', function(req,res){
    console.log('POST: /user_type');

    var uname = req.session.uname;
    var query = "select admin from user where uname = '"+uname+"'";
    con.query(query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        if(data[0] === 1) {
            res.send({"user_type": "admin"});
        }
        else if(data[0] === 0) {
            res.send({"user_type": "user"});
        }
        else {
            res.send({"user_type": "guest"});
        }
    });

});

//fetching tracks as per the search query
router.post('/search_track', function(req,res){

    var search_query = req.body.search_track;
    var query = "select track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id";
    con.query(query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        //iterate and seperate genre by comma
        for(var i=0; i<data.length; i++) {
            data[i].genre = data[i].genre.split(",");
        }
        res.send(data);
    });
});

//deleting items/tracks from cart
router.get('/delete_cart', function(req,res){
    var uname = req.session.uname;
    var trackid = req.body.track_id;
    var fetch_query = "delete from cart where track_id ='"+trackid+"' and uname='"+uname+"'";
    con.query(fetch_query, function(err, result, fields) {
        if(err)
            res.status(500).send();
        else
            res.status(200).send();

    });
});

//fetching cart details for a user
router.get('/fetch_cart', function(req,res){
    var uname = req.session.uname;
    var fetch_query = "select * from track where track_id in (select track_id from cart where uname ='"+uname+"')";
    con.query(fetch_query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        res.send(data[0]);
    });
});

//sign out
router.get('/signout', function(req,res){
    req.session.destroy();
    res.status(200).send({"user_type": "guest"});
});

//purchase order (move from cart to purchase table)
router.get('/purchase', function(req,res){
    var uname = req.session.uname;
    var current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var query = "insert into purchase (uname, track_id) select * from cart where uname = '"+uname+"'";
    var query_date = "insert into purchase (date) values ('"+current_date+"') where uname = '"+uname+"'";
    con.query(query, function(err, result, fields) {
        if(err) throw err;
        con.query(query_date, function(err, result, fields) {
            if(err) throw err;
            data = JSON.parse(JSON.stringify(result));
            res.send(data[0]);
        });
    });
});

module.exports = router;
