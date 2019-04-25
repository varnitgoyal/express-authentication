var express = require("express");
var router = express.Router();
var passport = require("../passport").passport;
const { check, validationResult } = require("express-validator/check");
const { register, findUser } = require("../controllers/user-controller");

/* GET home page. */

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("/");
  }
);
router.get("/", (req, res, next) => {
  res.render("index", { data: req.user });
});

router.get("/logout",(req,res,next)=>{
  req.logout();
  res.send("logged out successfully")
})

router.get("/login", (req, res, next) => {
  res.render("login", { title: "express app" });
});

router.get("/signup", (req, res, next) => {
  res.render("register", { title: "signup" });
});

router.get(
  "/facebookLogin",
  passport.authenticate("facebook", { scope: ["email"] }),
  (req, res, next) => {
    res.end();
  }
);

/*post requests */

router.post("/login", passport.authenticate("local"), function(req, res, next) {
  res.redirect("/");
});



router.post(
  "/signup",
  [
    check("email").isEmail(),
    check("username")
      .not()
      .isEmpty(),
    check("password")
      .not()
      .isEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    } else {
      res.status(200);
      const { username, password } = req.body;
      register(req.body, res)
        .then(res => findUser(username, password))
        .then(result => {
          req.login(result, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/");
            }
          });
        })

        .catch(err => console.log("something went wrong", err));
    }
  }
);
module.exports = router;
