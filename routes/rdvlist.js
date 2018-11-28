var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "naossistant"
});

/* GET home page. */
router.get('/', function(req, res, next) {
    con.query("SELECT * FROM rdv WHERE date_debut >= NOW() ORDER BY date_debut ASC", function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('rdv',{out: result});
    });

});

module.exports = router;
