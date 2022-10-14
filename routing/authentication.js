const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authofuser = require("../middleware/authofuser");
const router = express.Router();
require("../database/mongoconnection");
const User = require("../schema/userSchema");

router.get("/", (req, res) => {
  res.send("Hello from router");
});

router.post("/registerForm", async function (req, res, next) {
  console.log('registerform backend');
  console.log(req.body);
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "user already exist" });
    } else {
      // console.log("firstname", firstName);
      // console.log("lastname", lastName);
      // console.log("username", userName);
      // console.log("email", email);
      // console.log("password", password);
      const user = new User({
        firstname: firstName,
        lastname: lastName,
        username: userName,
        email: email,
        password: password,
      });
      console.log('user',user);

      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "user registered successfuly" });
      } else {
        res.status(500).json({ error: "failed to register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/loginForm", async (req, res) => {
  let token;
  // console.log(req.body);
  const { email, password } = req.body;
// console.log('email',email);
// console.log('password',password);
    try {
      const userLogin = await User.findOne({ email: email });
      if (!userLogin) {
        res.status(422).json({ error: "Invalid User" });
      } else {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          res.status(422).json({ error: "Invalid Credentials" });
        } else {
          token = await userLogin.generateAuthToken();
          res.cookie("jwttoken", token, {
            httpOnly: true,
          });
          res.json(token);
        }
      }
    } catch (err) {
      console.log(err);
    }
  
});

router.get("/user", authofuser, function (req, res, next) {
  return res.status(200).json(req.user);
});


// router.get("/myblogsdata", authofuser, async (req, res) => {
//   res.status(200).send(req.rootUser);
// });

// router.post("/blogsupload", authofuser, async (req, res) => {
//   try {
//     const { blogtitle, blogcontent } = req.body;
//     if (!blogtitle || !blogcontent) {
//       console.log("error in writing blog");
//       return res.status(400).json({ error: "plz write the blog correctly" });
//     } else {
//       const userContact = await User.findOne({ _id: req.userID });
//       const userBlog = await userContact.addMessage(blogtitle, blogcontent);
//       await userContact.save();
//       res.status(200).json({ message: "Your Blog saved successfully" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/theblogs", async (req, res) => {
//   req.change = await User.find();
//   res.status(200).send(req.change);
// });

router.get("/logout", authofuser, (req, res) => {
  res.clearCookie("jwttoken", { path: "/" });
  res.status(200).json({ message: "User Logged Out Successfully" });
});
module.exports = router;