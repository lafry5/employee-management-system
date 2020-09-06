const router = require("express").Router();
const { Admin, Employee } = require("../../models");

//Create an admin
router.post("/", (req, res) => {
  Admin.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.adminId = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login
router.post("/login", (req, res) => {
  Admin.findOne({
    where: {
      username: req.body.username,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No admin account found!" });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.save(() => {
      req.session.adminId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "You are now logged in as Admin!" });
    });
  });
});

//Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    res.json({message: "You are now logged out!" });
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

//Create Employee



module.exports = router;