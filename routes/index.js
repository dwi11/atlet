var express = require("express");
var router = express.Router();
var connection = require("../config/db");
var session = require('express-session');

router.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "rahasia",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 60000,
    },
  })
)

/* GET home page. */
router.get("/", function (req, res, next) {
  // box
  connection.query(
    " SELECT COUNT(*) AS total FROM atlet;",
    (err, countAtlet) => {
      if (err) {
        return console.log("error: " + err.message);
      }
      connection.query(
        " SELECT COUNT(*) AS total FROM pelatih;",
        (err, countPelatih) => {
          if (err) {
            return console.log("error: " + err.message);
          }
          connection.query(
            " SELECT COUNT(*) AS total FROM cabor;",
            (err, countCabor) => {
              if (err) {
                return console.log("error: " + err.message);
              }
              connection.query(
                "SELECT tahun_mulai FROM atlet;",
                (err, chartTahun) => {
                  if (err) {
                    return console.log("error: " + err.message);
                  }
                  connection.query(
                    'SELECT COUNT(*) as atlet_renang FROM atlet WHERE cabor = "renang"',
                    (err, chartRenang) => {
                      if (err) {
                        return console.log("error: " + err.message);
                      }
                  connection.query(
                    'SELECT COUNT(*) as atlet_takraw FROM atlet WHERE cabor = "takraw"',
                    (err, chartTakraw) => {
                      if (err) {
                        return console.log("error: " + err.message);
                      } if (!req.session.username) {
                        res.redirect('/auth');
                        return;
                      }
                      res.render("index", {
                        title: "Dashboard",
                        countAtlet: countAtlet,
                        countAtlet: countAtlet,
                        countPelatih: countPelatih,
                        countCabor: countCabor,
                        chartTahun: chartTahun,
                        chartRenang: chartRenang,
                        chartTakraw: chartTakraw,
                      });
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
