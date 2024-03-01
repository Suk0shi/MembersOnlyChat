const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: Boolean },
  admin: { type: Boolean }
});

// Virtual for book's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/home/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);