"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearIncidente5 = crearIncidente5;
const AuxFunctions_1 = require("./AuxFunctions");
const database_1 = require("../database");
function crearIncidente5() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield database_1.sequelize.transaction();
        try {
            const fechaAleatoria = (0, AuxFunctions_1.generarFechaAleatoria2024)(); // Generamos una fecha aleatoria
            const hospital = yield (0, AuxFunctions_1.crearHospital)("Hospital del Tórax", "Toxicología", transaction);
            const medico = yield (0, AuxFunctions_1.crearMedico)("Dra. Morales", "Medico", null, hospital, transaction);
            const persona = yield (0, AuxFunctions_1.crearPersona)({
                No_Identidad: "0801-1980-98765",
                Nombre: "Rosa Hernández",
                Genero: false,
                Telefono: "9999-5555",
                FechaNacimiento: new Date(1980, 11, 20),
                Ocupacion: "Ama de casa",
                Direccion: "Col. Monte Verde",
                EstadoCivil: "C",
            }, transaction);
            const empleado = yield (0, AuxFunctions_1.crearEmpleado)(persona, "Paramedico", "pm", "10:00:00", "18:00:00", transaction);
            const ambulancia = yield (0, AuxFunctions_1.crearAmbulancia)("A-900", true, [empleado], transaction);
            const acompanante = yield (0, AuxFunctions_1.crearAcompanante)("Carlos Hernández", "Esposo", transaction);
            const empleadoAdicional = yield database_1.Empleado.findOne({
                where: { IDEmpleado: 4 },
            });
            const incidente = yield (0, AuxFunctions_1.crearIncidente)(persona, acompanante, empleadoAdicional, "Col. Monte Verde, Bloque 7", "Intoxicación por Humo", "Rojo", "Paciente fue encontrada inconsciente en un incendio doméstico con signos de intoxicación por humo.", "TrasladoSolamente", 3, ["Otros"], ["Quemadura superficial en brazo izquierdo", "Debilidad muscular"], transaction, fechaAleatoria);
            yield (0, AuxFunctions_1.registrarSalidaAmbulancia)(ambulancia, incidente, transaction);
            yield (0, AuxFunctions_1.registrarOxigeno)(incidente, {
                Uso: "Oxígeno suplementario por mascarilla",
                OxigenoLitro: 4,
                OxigenoTiempo: 30,
                OxigenoCanOrofa: true,
                OxigenoCollarCerv: false,
            }, transaction);
            yield (0, AuxFunctions_1.registrarGlascow)(incidente, {
                RespuestaVisual: "AbreEstimuloDoloroso",
                RespuestaVerbal: "SonidoImcomprensible",
                RespuestaMotora: "SeRetiraDelDolor",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteEfectosPersonales)(incidente, {
                Resguardo: true,
                Pol: true,
                Fam: false,
                Pers_Hospital: true,
                Otros: "Bolso con identificación y medicación del paciente.",
                PX: "Inestable",
            }, transaction);
            yield (0, AuxFunctions_1.registrarSignosVitales)(incidente, {
                P_A: "85/60",
                FR: 30,
                FC: 110,
                SpO2: 85,
                Temp: 36.8,
                Glucosa: 110,
                UbicacionLesion: "Brazo izquierdo",
                ImagenLesion: null,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPupilas)(incidente, {
                OjoDerecho: "Contraido",
                OjoIzquierdo: "Contraido",
                Normales: false,
                Reactivas: true,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteChequeo)(incidente, {
                ExamenFisico: ["Paciente con quemaduras superficiales y dificultad respiratoria."],
                Observaciones: "Urgente traslado a toxicología para manejo de intoxicación severa.",
                CondicionPaciente: 4,
            }, transaction);
            yield transaction.commit();
            console.log("Incidente de intoxicación por humo creado exitosamente.");
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error al crear el incidente de intoxicación por humo:", error);
        }
    });
}
