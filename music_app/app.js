var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(bodyParser.json());
app.use(session({secret:"string used for encrypting session", resave:false, saveUninitialized:true}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "musicstore"
});

app.get('/', function(req,res){
    res.send('home page: nothing to see here');
});

// Fetches one track randomly
app.get('/db/track/fetchOne', function(req,res){
    console.log('GET: /db/track/fetchOne');
    
    con.query("select * from track order by rand() limit 1", function (err, result, fields) {
	if (err) throw err;
	data = JSON.parse(JSON.stringify(result));
	res.send(data[0]);
    });
});

// Fetche requested track
// input: { track_id: '549e1ffd66ac099ccadbf6f61729897b' }
app.post('/db/track/fetch', function(req,res){
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

// Checks if the user is authenticated
app.get('/login/auth-status', function(req,res){
    console.log('GET: /login/auth-status');

    if(!req.session.uname){
        console.log("unauthorized");
        res.send("unauthorized");
    }else{
        console.log("logged in");
        res.send("logged in");
    }
});

app.listen(3000);
console.log('Running on port 3000');

