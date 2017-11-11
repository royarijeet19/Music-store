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


// Authenticate user
// input: {"uname":"test","pwd":"test123"}
app.post('/login', function(req,res){
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

// // Authenticate user
// app.get('/login', function(req,res){
//     console.log('GET: /login');

//     res.render('login');
// });


// signup new user
app.get('/signup', function(req,res){
    console.log('GET: /signup');

    res.render('signup');
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
// // display user purchase history
// app.get('/purchases', function(req,res){
//     console.log('GET: /purchases');

//     res.render('purchases');
// });

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


// //--------------------------
// //---------Pages------------
// //--------------------------
app.post('/search', function(req,res){
    console.log(JSON.stringify(req.body));
    console.log(req.body.search_track);
    req.session.search_track=req.body.search_track;
    res.render('search');
});
app.get('/search', function(req,res){
    console.log(JSON.stringify(req.body));
    res.render('search');
});
// app.post('/search', function(req,res){
//      console.log('POST: /search');
//      console.log(JSON.stringify(req.body));

//     var query = req.body.query;
//     if (query){
//         req.session.query = query;
//         res.sendStatus(200);
//     }
// });


//--------------------------
//-------Resources----------
//--------------------------
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/other',express.static(path.join(__dirname, 'other')));
app.use('/fonts',express.static(path.join(__dirname, 'fonts')));


app.listen(3000);
console.log('Running on port 3000');

