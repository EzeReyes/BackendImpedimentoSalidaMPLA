const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema({
    vessel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vessel",
        required: true
    },

    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "MANTIENE_PENDIENTE_S",
            "SIN_PENDIENTES",
            "MANTIENE_PENDIENTE_S_SE_OTORGO_PLAZO_PARA_NAVEGAR_VER_INFORME"
        ]
    },
    type: {
        type: String,
        enum: [
            "INICIAL",
            "MAS_DETALLADA",
            "DE_SEGUIMIENTO"
        ],
        required: true
    },

    code: {
        type: String,
        enum: [
            "CODIGO_30",
            "CODIGO_17",
            "CODIGO_18",
            "CODIGO_ROJO",
            "CODIGO_10",
            "SIN_PENDIENTES"
        ],
        required: true
    },

    inform: String,

    reason: String,

    previousInspection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inspection"
    }
});

module.exports = mongoose.model("Inspection", inspectionSchema);