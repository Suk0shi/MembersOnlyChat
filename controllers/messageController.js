const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const user = require("../models/user");

// Display list of all Messages.
exports.messageboard = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find().sort('-timestamp').limit(10).populate("user").exec();
    res.render("messageboard", {
      title: "Message Board",
      messages: allMessages.reverse(),
      user: req.user,
    });
});

exports.message_post = [
  // Validate and sanitize fields.
  body("message", "Please type a message to send")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
    
      // Create a User object with escaped and trimmed data.
      const message = new Message({
        user: req.user,
        timestamp: Date.now(),
        text: req.body.message,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        res.render("messageboard", {
          title: "Message Board",
          messages: allMessages,
          member: req.user.member,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save user.
        await message.save();
        res.redirect("/home/messageboard");
      }
  })
];

// Display message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await 
    Message.findById(req.params.id).exec();

  if (message === null) {
    // No results.
    res.redirect("/home/messageboard");
  }

  res.render("message_delete", {
    title: "Delete Message",
    message: message,
  });
});

// Handle message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await 
    Message.findById(req.params.id).exec();
    
    // Delete object and redirect to the list of books.
    await Message.findByIdAndDelete(req.body.messageid);
    res.redirect("/home/messageboard");
});