var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

//body parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "naossistant"
});

//con.connect();
var router = express.Router();

router.get('/', function (req, res, next) {
    con.query("SELECT * FROM medecin", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/search/:name', function (req, res, next) {
    con.query("SELECT * FROM medecin WHERE med_name = ?", req.params.name, function (err, result) {
        if (err) throw err;
        //console.log(result.length);
        if (typeof result === 'undefined' || result === null || result.length === 0) {
            res.send({code: "404", error: "Ce medecin n'existe pas"})
        } else {
            res.send(result);
        }
    })
});

module.exports = router;
//con.end();