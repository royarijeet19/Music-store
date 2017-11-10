var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
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

module.exports = router;
