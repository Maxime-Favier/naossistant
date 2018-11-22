var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "naossistant"
});

//con.connect();
var router = express.Router();


router.get('/', function (req, res, next) {
    con.query("SELECT * FROM patients", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/search/:name', function (req, res, next) {
    con.query("SELECT * FROM patients WHERE nom = ?", req.params.name, function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (typeof result === 'undefined' || result === null || result.length === 0) {
            res.send({code: "404", error: "Not found"})
        } else {
            res.send(result);
        }
    })
});

router.get('/add', function (req, res) {
    var salle = req.query.salle;
    var nom = req.query.nom;
    //console.log(salle);
    //console.log(nom);
    var sql = 'INSERT INTO patients (nom, salle) VALUE ?';
    con.query(sql, [nom, salle], function (err, result) {
        if (err) throw err;
        //console.log("Number of records inserted: " + result.affectedRows);
        res.send('200 OK');
    });
});

module.exports = router;
//con.end();