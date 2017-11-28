var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "musicstore"
});


var purchase_id_auto_incr = 0;
var fetch_query = "select * from purchase";
con.query(fetch_query, function (err, result, fields) {
    if (err) throw err;
    data = JSON.parse(JSON.stringify(result));
    console.log(data);
    if(data != [] && data.length != 0) {
        console.log(data);
        purchase_id_auto_incr = data[data.length - 1].purchase_id;
        purchase_id_auto_incr++;
    }
});

// ---------------------------------------
// --------- SIGNING FUNCTIONS -----------
// ---------------------------------------

//signup user
router.post('/signup', function(req,res){
    console.log('POST: /api/signup');
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
router.post('/signin', function(req,res){
    console.log('POST: /api/signin');
    console.log(JSON.stringify(req.body));

    var uname = req.body.uname;
    var pwd = req.body.pwd;
    var query = "select * from user where uname = '"+uname+"'";
    con.query(query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        console.log(data);
        if(data.length==0){
            res.status(401).send();
        }else{
            data=data[0];
            console.log(data.pwd);
            console.log(pwd);
            if(data.pwd==pwd){
                console.log("User: "+uname+", authorized");
                req.session.uname=uname;
                res.status(200).send();
            }else{
                res.status(401).send();
            }
        }
    });
});


//sign out
router.get('/signout', function(req,res){
    console.log("GET /api/signout");

    req.session.destroy();
    res.status(200).send({"user_type": "guest"});
});


// Return the type of user
// output: {"user_type": x}
// where x is any of "admin" "user" "guest"
router.get('/user_type', function(req,res){
    console.log('POST: /api/user_type');

    var uname = req.session.uname;
    var query = "select admin from user where uname = '"+uname+"'";
    con.query(query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        if(data.length==0){
        	res.send({"user_type": "guest"});
        }else{
        	var isAdmin = data[0].admin.data[0];
        	if(isAdmin==1){
        		res.send({"user_type": "admin"});
        	}else{
        		res.send({"user_type": "user"});
        	}
        }
    });

});

// ----------------------------------------
// ----------- SEARCH FUNCTIONS -----------
// ----------------------------------------

// Search db using session variables (not GET request anymore)
router.get('/search_track', function(req,res){
	console.log('/api/search_track');

    var search_query = req.session.search_track;
    var orderby = req.session.orderby;

	if(orderby==" Cost"){
		var query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id order by price";
	}else if(orderby==" Year"){
		var query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id order by year";
	}else if(orderby==" Track no"){
		var query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id order by track_no";
	}else if(orderby==" Duration"){
		var query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id order by length";
	}else{
		var query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_name LIKE '%"+search_query+"%' group by track.track_id";
    }
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

// Returs search parameters stored in session variables
router.get('/get_search_params', function(req,res){
	console.log("GET /api/get_search_params");
	console.log(JSON.stringify(req.body));

	var data = {"search_track":req.session.search_track,
				"sortby":req.session.sortby};
	res.send(data);
});

// Stores session variables for search
router.post('/search', function(req,res){
    console.log('POST: /api/search');
    console.log(JSON.stringify(req.body));

    req.session.search_track=req.body.search_track;
    req.session.orderby=req.body.orderby;
    res.status(200).send();
});


// ----------------------------------------
// ------------- CART FUNCTIONS -----------
// ----------------------------------------

//----------------------------
// Add item to user Cart
// input: {"track_id":"549e1ffd66ac099ccadbf6f61729897b"}
router.post('/add_to_cart', function(req,res){
    console.log('POST: /api/add_to_cart');
    console.log(JSON.stringify(req.body));

    var uname = req.session.uname;
    var track_id = req.body.track_id;
    var add_to_cart_query = "insert into cart (uname, track_id) values ('"+uname+"', '"+track_id+"');"
    con.query(add_to_cart_query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        res.send(data[0]);
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
    console.log("GET /api/fetch_cart");

    var uname = req.session.uname;
    var fetch_query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_id in (select track_id from cart where uname ='"+uname+"') group by track.track_id";
    // var fetch_query = "select * from track where track_id in (select track_id from cart where uname ='"+uname+"')";
    con.query(fetch_query, function(err, result, fields) {
        if(err) throw err;
        data = JSON.parse(JSON.stringify(result));
        res.send(data);
    });
});


//purchase order (move from cart to purchase table)
router.get('/make_purchase', function(req,res){
    console.log("GET /api/make_purchase");

    var uname = req.session.uname;
    var current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var query = "insert into purchase (uname, track_id) select * from cart where uname = '"+uname+"'";
    
    con.query(query, function(err, result, fields) {
        if(err) throw err;

        var query_date = "insert into purchase (purchase_id, date) values ('"+purchase_id_auto_incr+"', '"+current_date+"') where uname = '"+uname+"'";
        con.query(query_date, function(err, result, fields) {
            if(err) throw err;
            var delete_from_cart = "delete from cart where uname = '"+uname+"'";

            con.query(delete_from_cart, function(err, result, fields) {
                if(err) throw err;
                var fetch_query = "select track.track_id as track_id, track.track_name as track, track.price, track.track_no, track.length, album.year, album.album_art, album.album_name as album, album.artist_art, album.artist, group_concat(genre.genre) as genre from track join album on track.album_id = album.album_id join genre on track.track_id = genre.track_id where track.track_id in (select track_id from purchase where uname ='"+uname+"') group by track.track_id";
                con.query(fetch_query, function(err, result, fields) {
                    if(err) throw err;
                    data = JSON.parse(JSON.stringify(result));
                    var result = {};
                    result[current_date] = data;
                    res.send(result);
                });
            });
        });
    });
});

//purchase history
router.get('/purchase_history', function(req,res){
    console.log("GET /api/purchase_history");

});

// ----------------------------------------
// -----------  ADMIN FUNCTIONS -----------
// ----------------------------------------
router.put('/track', function(req,res){
    console.log('PUT: /api/track');
    console.log(JSON.stringify(req.body));
    
    
    res.status(200).send()
});

router.get('/edit_type', function(req,res){
    console.log('GET: /api/edit_type');

    res.send({"edit_type":req.session.edit_type});
});


module.exports = router;
