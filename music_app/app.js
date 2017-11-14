var mysql = require('mysql');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var api = require('./js/api');

var app = express();
app.use(bodyParser.json());
app.use(session({secret:"string used for encrypting session", resave:false, saveUninitialized:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/api', api);


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "musicstore"
});

app.get('/', function(req,res){
    res.render('home');
});



// // edit_item new user
// app.get('/edit_item', function(req,res){
//     console.log('GET: /edit_item');

//     data = {edit_header:"Add track"}
//     res.render('edit_item',data);
// });

// // edit_item new user
// app.post('/edit_item', function(req,res){
//     console.log('POST: /edit_item');
//     console.log(JSON.stringify(req.body));

//     res.render('edit_item');
// });

// // display user cart
// app.get('/cart', function(req,res){
//     console.log('GET: /cart');

//     res.render('cart');
// });
// display user purchase history
app.get('/get_purchases', function(req,res){
    console.log('GET: /purchases');

    data =[{
    "timestamp1": [{
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
    ]},
    {"timestamp2": [{
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
    ]}];

    res.send(data);
});

// // Checks if the user is authenticated
// app.get('/login/auth-status', function(req,res){
//     console.log('GET: /login/auth-status');

//     if(!req.session.uname){
//         console.log("unauthorized");
//         res.send("unauthorized");
//     }else{
//         console.log("logged in");
//         res.send("logged in");
//     }
// });


// //----------------------------
// // Add item to user Cart
// // input: {"track_id":"549e1ffd66ac099ccadbf6f61729897b"}
// app.post('/add_to_cart', function(req,res){
//     console.log('POST: /add_to_cart');
//     console.log(JSON.stringify(req.body));

// });

// // Return the type of user
// // output: {"user_type": x}
// // where x is any of "admin" "user" "guest"
// app.get('/user_type', function(req,res){
//     console.log('POST: /user_type');

//     res.send({"user_type": "guest"});

// });

// // Sign out user
// // output: {"status": 200}
// // where x is any of "admin" "user" "guest"
// app.get('/signout', function(req,res){
//     console.log('POST: /signout');

//     res.send({"status": 200});

// });


//--------------------------
//---------Pages------------
//--------------------------

app.get('/search', function(req,res){
    console.log('GET: /search');
    
    res.render('search');
});


// signup new user
app.get('/signup', function(req,res){
    console.log('GET: /signup');

    res.render('signup');
});

// Login user
app.get('/login', function(req,res){
    console.log('GET: /login');

    res.render('login');
});

app.get('/cart', function(req,res){
    console.log('GET: /cart');

    res.render('cart');
});

app.get('/purchases', function(req,res){
    console.log('GET: /purchases');

    res.render('purchases');
});

app.get('/edit_item', function(req,res){
    console.log('GET: /edit_item');

    res.render('edit_item');
});

app.get('/edit_items', function(req,res){
    console.log('GET: /edit_items');

    res.render('edit_items');
});

//--------------------------
//-------Resources----------
//--------------------------
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/other',express.static(path.join(__dirname, 'other')));
app.use('/fonts',express.static(path.join(__dirname, 'fonts')));


app.listen(3000);
console.log('Running on port 3000');

