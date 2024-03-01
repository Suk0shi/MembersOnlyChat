const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs")


const asyncHandler = require("express-async-handler");



exports.login = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    
  
    res.render("login", {
      title: "Login",
      user: req.user
    });
});

exports.signUp = asyncHandler(async (req, res, next) => {
    res.render("signUp", {
        title: "Sign Up"
      });
});

exports.signUp_post = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("surname", "Surname must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("username", "Username must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("password", "Password must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("passwordConfirm", "Password confirmation must match")
      .custom((value, { req }) => {
        return value === req.body.password;
      }),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        // Create a User object with escaped and trimmed data.
        const user = new User({
          name: req.body.name,
          surname: req.body.surname,
          username: req.body.username,
          password: hashedPassword
        });
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
    
          res.render("signUp", {
            title: "Sign Up",
            user: user,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save user.
          await user.save();
          res.redirect("/");
        }
    })
    }),
];

exports.joinClub = asyncHandler(async (req, res, next) => {
  res.render("joinClub", {
      title: "Become a Member",
      user: req.user
    });
});

exports.joinClub_post = [
  // Validate and sanitize fields.
  body("password", "Incorrect Password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      return value === "1234";
    }),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a User object with escaped and trimmed data.
      const user = req.user;
      const updatedUser = new User({
        name: user.name,
        surname: user.surname,
        username: user.username,
        password: user.password,
        membership: true,
        _id: user.id
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        res.render("joinClub", {
          title: "Become a Member",
          user: req.user,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save user.
        await User.findByIdAndUpdate(user._id, updatedUser, {});
        res.redirect("/");
      }
  })
];

exports.admin = asyncHandler(async (req, res, next) => {
  res.render("admin", {
      title: "Become an Admin",
      user: req.user
    });
});

exports.admin_post = [
  // Validate and sanitize fields.
  body("password", "Incorrect Password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      return value === process.env.ADMIN_PASSWORD;
    }),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a User object with escaped and trimmed data.
      const user = req.user;
      const updatedUser = new User({
        name: user.name,
        surname: user.surname,
        username: user.username,
        password: user.password,
        membership: true,
        _id: user.id,
        admin: true
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        res.render("admin", {
          title: "Become an Admin",
          user: req.user,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save user.
        await User.findByIdAndUpdate(user._id, updatedUser, {});
        res.redirect("/");
      }
  })
];