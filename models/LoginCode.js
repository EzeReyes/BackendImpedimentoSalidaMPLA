// const mongoose = require('mongoose');

// const LoginCodeSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   code: {
//     type: String,
//     required: true,
//   },

//   expiresAt: {
//     type: Date,
//     required: true,
//   },

//   used: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model("LoginCode", LoginCodeSchema);

//ejemplo de como implementar el modelo de LoginCode en un resolver de GraphQL