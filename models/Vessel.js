const mongoose = require("mongoose");

const vesselSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tuition: {
        type: String,
        required: true
    }
});

const Vessel = mongoose.model('Vessel', vesselSchema);

module.exports = Vessel;