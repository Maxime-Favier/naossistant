var express = require('express');
var router = express.Router();
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


/* GET home page. */
router.get('/', function(req, res, next) {
    con.query("SELECT * FROM rdv ORDER BY date_debut", function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    });

});

router.get('/future', function(req, res, next) {
    con.query("SELECT * FROM rdv WHERE date_debut >= NOW() ORDER BY date_debut ASC", function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    });

});

router.post('/add', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var patient_name = req.body.patient_name;
    var dr_name = req.body.dr_name;
    var date_debut = req.body.date_debut;
    var date_fin = req.body.date_fin;
    var sql = 'INSERT INTO rdv (patient_name, dr_name, date_debut, date_fin) VALUE (?, ?, ?, ?)';
    con.query(sql, [patient_name, dr_name, date_debut, date_fin], function (err, result) {
        if (err) throw err;
        //console.log('OK');
        res.redirect("/rdv");
    });
});

module.exports = router;
