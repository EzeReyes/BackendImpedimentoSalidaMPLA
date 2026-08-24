const Vessel = require('../models/Vessel');
const Inspection = require('../models/Inspection');

// Resolvers
resolvers = {
    Query: {
        getVessels : async () => {
            try {
            const buques = await Vessel.find();
            return buques; 
            } catch(error) {
                console.log(error)
            }
        },
        getVessel : async (_, {id}) => {
            try {
            const buque = await Vessel.findById(id);
            return buque; 
            } catch(error) {
                console.log(error)
            }
        },
        getInspections : async () => {
            try {
                const inspecciones = await Inspection.find().populate('vessel').populate('previousInspection');
                return inspecciones;
            } catch(error) {
                console.log(error)
            }
        },
        getInspection : async (_, {id}) => {
            try {
                const inspeccion = await Inspection.findById(id).populate('vessel').populate('previousInspection');
                return inspeccion;
            } catch(error) {
                console.log(error)
            }
        }
    },
    Mutation: {
        newVessel: async (_, { input }) => {
            const { name, tuition} = input;
            const newVessel = new Vessel({
                name,
                tuition
            });

            try {
                const nuevoBuque = await newVessel.save();
                console.log("Guardado:", nuevoBuque);
                return nuevoBuque;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        editVessel: async (_, { id, input }) => {
            try {
                const { name, tuition } = input;

                if (!name) {
                    throw new Error('Falta agregar nombre');
                }

                if (!tuition) {
                    throw new Error('Falta agregar matrícula');
                }

                const buqueEditado = await Vessel.findByIdAndUpdate(
                    id,
                    input,
                    { new: true }
                );

                return buqueEditado;

            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        },
        newInspection: async (_, { input }) => {
            const { vessel, date, type, inform, reason, code, previousInspection, status } = input;
            if(!vessel || !date || !type || !code, !inform || !reason || !status) {
                throw new Error('Faltan campos obligatorios');
            }
            const newInspection = new Inspection({
                vessel,
                date,
                type,
                inform,
                reason,
                code,
                previousInspection,
                status
            });
            return await newInspection.save();
        },
        editInspection: async (_, {id, input}) => {
            const { vessel, date, type, inform, reason, code, previousInspection, status } = input;
            if(!vessel || !date || !type || !code, !inform || !reason || !status) {
                throw new Error('Faltan campos obligatorios');
            }
            const inspectionEditada = await Inspection.findByIdAndUpdate(id, input, { new: true });
            return inspectionEditada;
        },
        deleteVessel: async (_, {id}) => {  
            const vessel = await Vessel.findById(id);
            if(!vessel) {
                throw new Error('Buque no encontrado');
            }
            vessel.inspections = await Inspection.deleteMany({ vessel: id });
            await Vessel.deleteOne({_id: id});
            return "Buque eliminado";
        },
        deleteInspection: async (_, {id}) => {
            const inspection = await Inspection.findById(id);
            if(!inspection) {
                throw new Error('Inspección no encontrada');
            }
            await Inspection.deleteOne({_id: id});
            return "Inspección eliminada";
        }
    }
}

module.exports = resolvers;
