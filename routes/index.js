var express = require("express");
var router = express.Router();
var connection = require("../config/db");

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

              res.render("index", {
                title: "Dashboard",
                countAtlet: countAtlet,
                countAtlet: countAtlet,
                countPelatih: countPelatih,
                countCabor: countCabor,
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
