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
    con.query("SELECT * FROM patients", function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    });
});

router.get('/search/:name', function (req, res, next) {
    con.query("SELECT * FROM patients WHERE nom = ?", req.params.name, function (err, result) {
        if (err) throw err;
        //console.log(result.length);
        if (typeof result === 'undefined' || result === null || result.length === 0) {
            res.send({code: "404", error: "Not found"})
        } else {
            res.send(result);
        }
    })
});

router.post('/add', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var salle = req.body.salle;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var sql = 'INSERT INTO patients (nom, prenom, salle) VALUE (?, ?, ?)';
    con.query(sql, [nom, prenom, salle], function (err, result) {
        if (err) throw err;
        //console.log('OK');
        res.redirect("/patient");
    });
});

router.get('/del/:id', function (req, res) {
    //console.log(req.body);
    var sql = 'DELETE FROM patients WHERE id = ?';
    con.query(sql, req.params.id, function (err, result) {
        if (err) throw err;
        //console.log('OK');
        res.redirect("/patient");
    });
});
module.exports = router;
//con.end();