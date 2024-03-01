const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
});

// Virtual for book's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/home/message/${this._id}`;
});

MessageSchema.virtual("timestampFormatted").get(function () {
  return this.timestamp ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED) : '';
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);