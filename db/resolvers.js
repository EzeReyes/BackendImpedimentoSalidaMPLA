const Vessel = require('../models/Vessel');
const Inspection = require('../models/Inspection');
const User = require('../models/User');
const crypto = require("crypto");
require('dotenv').config({ path: '.env' });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generarCodigo = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

const hashCode = (code) => {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
};

// Resolvers
resolvers = {
    Query: {
verificarSesion: async (_, __, { req }) => { // 🧠 ¡Nota las llaves { req }!
  if (!req || !req.cookies) {
    console.log("¡Alerta! Req o cookies siguen viniendo vacíos");
    return null;
  }        try {
            // 1. Intentamos leer la cookie que guardamos en el login
            const token = req.cookies.elToken;

            // 2. Si no hay cookie, devolvemos null (el frontend sabrá que no hay sesión)
            if (!token) {
            return null;
            }

            // 3. Verificamos si el token de la cookie es válido
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Buscamos al usuario en la base de datos usando el ID del token
            const usuario = await User.findById(decodificado.userId);

            // 5. Si el usuario existe, se lo enviamos al frontend
            if (usuario) {
            return {
                id: usuario._id.toString(),
                email: usuario.email,
                // Puedes añadir aquí más campos que necesites en el frontend
            };
            }

            return null;
        } catch (error) {
            // Si el token expiró o es falso, jwt.verify lanzará un error. 
            // En lugar de romper la app, devolvemos null para indicar "sesión inválida".
            console.error("Error al validar la cookie de sesión:", error.message);
            return null;
        }
        },
        getVessels: async () => {
            try {
                const buques = await Vessel.find();

                const inspecciones = await Inspection.find()
                    .populate('vessel')
                    .populate('previousInspection');

                const buquesConInspecciones = buques.map(buque => {
                    const inspeccionesDelBuque = inspecciones.filter(
                        inspeccion =>
                            inspeccion.vessel &&
                            inspeccion.vessel._id.toString() === buque._id.toString()
                    );

                    return {
                        id: buque._id.toString(),
                        name: buque.name,
                        tuition: buque.tuition,
                        inspections: inspeccionesDelBuque
                    };
                });

                return buquesConInspecciones;

            } catch (error) {
                console.error(error);
                throw new Error("Error al obtener los buques");
            }
        },
        getVessel : async (_, {id}) => {
            try {
            const buque = await Vessel.findById(id);

            const inspecciones = await Inspection.find({vessel: id})
                    .populate('vessel')
                    .populate('previousInspection');

                    return {
                        id: buque._id.toString(),
                        name: buque.name,
                        tuition: buque.tuition,
                        inspections: inspecciones
                    };
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
        },
        getUsers: async () => {
            const users = await User.find();
            return users;
        },
        getUser: async (_, { id }) => {
            const user = await User.findById(id);
            return user;
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
        },
        createUser: async (_, {name, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Usuario ya existe');
            }

            const saltRounds = 10;
            password = await bcrypt.hash(password, saltRounds);

            const newUser = new User({ name, email, password });
            return await newUser.save();
        },
        login: async (_, { email, password }, { res }) => {
            try {
            const user = await User.findOne({ email });
            if(!user) {
                throw new Error("Usuario no encontrado");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error("Contraseña incorrecta");
            }

            const token = await jwt.sign({
                userId: user._id.toString(),
            },
                process.env.JWT_SECRET, {
                expiresIn: "7d",
                });

            console.log("Token generado:", token);

            try {
                res.cookie(
                "elToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
                });
        } catch (error) {
            console.error("Error al establecer la cookie:", error);
        }


            return "Inicio de sesión correcto, estas siendo redirigido ....";
            } catch (error) {
                throw new Error(error.message);
            }
        },
        logout: async (_, __, { res }) => {
            res.clearCookie("_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            return "Cierre de sesión correcto, estas siendo redirigido ....";
        },
            //ejemplo aplicado con código de inicio de sesión enviado por email, para mayor seguridad y evitar el uso de contraseñas
            // const code = Math.floor(100000 + Math.random() * 900000).toString();

            // const ahora = new Date();

            // const argentina = new Intl.DateTimeFormat("en-CA", {
            //     timeZone: "America/Argentina/Buenos_Aires",
            //     year: "numeric",
            //     month: "2-digit",
            //     day: "2-digit",
            // }).format(ahora);

            // const [year, month, day] = argentina.split("-").map(Number);

            // const expiresAt = new Date(
            //     Date.UTC(year, month - 1, day + 1, 3, 0, 0, 0)
            // );

            // await LoginCode.findOneAndUpdate(
            //     { userId: user._id },
            //     {
            //         code,
            //         expiresAt,
            //         used: false,
            //         attempts: 0,
            //     },
            //     {
            //         new: true,
            //         upsert: true,
            //     }
            // );
            
            //     await enviarCodigo(
            //     user.email.toString(),
            //         code.toString()
            //     );

            //     return "Verifique su casilla de email para obtener el código de inicio de sesión, en breve sera redireccionado a la página para acceder a la aplicación.";

            // } catch (error) {

            //     console.error(
            //     "Error enviando email:",
            //     error
            //     );
            // }
    //     verificarCodigo: async (
    //     _,
    //     { email, code },
    //     { res }
    //     ) => {

    //     const user = await User.findOne({ email });

    //     if (!user) {
    //         throw new Error("Usuario no encontrado");
    //     }

    //     const loginCode = await LoginCode.findOne({
    //         userId: user._id,
    //         used: false,
    //     }).sort({
    //         createdAt: -1,
    //     });

    //     if (!loginCode) {
    //         throw new Error(
    //         "No existe un código válido"
    //         );
    //     }



    //     if (
    //         loginCode.expiresAt.getTime() <
    //         Date.now()
    //     ) {

    //         loginCode.used = true;

    //         await loginCode.save();

    //         throw new Error(
    //         "El código ha expirado"
    //         );
    //     }

    //     if (loginCode.attempts >= 5) {

    //         loginCode.used = true;

    //         await loginCode.save();

    //         throw new Error(
    //         "Demasiados intentos"
    //         );
    //     }


    //    if (code !== loginCode.code) {

    //         loginCode.attempts += 1;

    //         await loginCode.save();

    //         throw new Error(
    //         "Código incorrecto"
    //         );
    //     }

    //     loginCode.used = true;

    //     await loginCode.save();

    //     return {
    //         success: true,

    //         message:
    //         "Inicio de sesión correcto",

    //         user,
    //     };
    //     },
    }
}

module.exports = resolvers;
