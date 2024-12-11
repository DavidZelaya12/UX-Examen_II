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
exports.crearIncidente2 = crearIncidente2;
const AuxFunctions_1 = require("./AuxFunctions");
const database_1 = require("../database");
const database_2 = require("../database");
function crearIncidente2() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield database_2.sequelize.transaction();
        try {
            const fechaAleatoria = (0, AuxFunctions_1.generarFechaAleatoria2024)();
            const hospital = yield (0, AuxFunctions_1.crearHospital)("Hospital Mario Catarino Rivas", "Urgencias", transaction);
            const medico = yield (0, AuxFunctions_1.crearMedico)("Dr. Hernandez", "Medico", null, hospital, transaction);
            const persona = yield (0, AuxFunctions_1.crearPersona)({
                No_Identidad: "0801-1995-54321",
                Nombre: "Carlos Pérez",
                Genero: true,
                Telefono: "9999-8888",
                FechaNacimiento: new Date(1995, 5, 15),
                Ocupacion: "Conductor",
                Direccion: "Col. Los Robles",
                EstadoCivil: "S",
            }, transaction);
            const empleado = yield (0, AuxFunctions_1.crearEmpleado)(persona, "Paramedico", "pm", "14:00:00", "22:00:00", transaction);
            const ambulancia = yield (0, AuxFunctions_1.crearAmbulancia)("A-450", true, [empleado], transaction);
            const acompanante = yield (0, AuxFunctions_1.crearAcompanante)("Luis Martínez", "Amigo", transaction);
            const empleadoJorge = yield database_1.Empleado.findOne({
                where: { IDEmpleado: 2 },
            });
            const incidente = yield (0, AuxFunctions_1.crearIncidente)(persona, acompanante, empleadoJorge, "Col. Las Lomas", "Colisión entre vehículos", "Rojo", "Paciente sufrió politraumatismos severos tras colisión entre vehículos.", "TrasladoSolamente", 4, ["Diarrea", "Otros"], ["Laceración grave en la cabeza", "Fractura en el brazo derecho"], transaction, fechaAleatoria);
            yield (0, AuxFunctions_1.registrarSalidaAmbulancia)(ambulancia, incidente, transaction);
            yield (0, AuxFunctions_1.registrarOxigeno)(incidente, {
                Uso: "Oxígeno suplementario por mascarilla",
                OxigenoLitro: 5,
                OxigenoTiempo: 20,
                OxigenoCanOrofa: false,
                OxigenoCollarCerv: true,
            }, transaction);
            yield (0, AuxFunctions_1.registrarGlascow)(incidente, {
                RespuestaVisual: "AbreEstimuloDoloroso",
                RespuestaVerbal: "SonidoImcomprensible",
                RespuestaMotora: "LocalizaElDolor",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteEfectosPersonales)(incidente, {
                Resguardo: false,
                Pol: true,
                Fam: true,
                Pers_Hospital: false,
                Otros: "Bolsa con documentos personales.",
                PX: "Critico",
            }, transaction);
            yield (0, AuxFunctions_1.registrarSignosVitales)(incidente, {
                P_A: "70/40",
                FR: 35,
                FC: 120,
                SpO2: 82,
                Temp: 37.2,
                Glucosa: null,
                UbicacionLesion: "Cabeza y brazo derecho",
                ImagenLesion: null,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPupilas)(incidente, {
                OjoDerecho: "Contraido",
                OjoIzquierdo: "Contraido",
                Normales: false,
                Reactivas: false,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteChequeo)(incidente, {
                ExamenFisico: ["Paciente con múltiples heridas, inconsciente."],
                Observaciones: "Paciente trasladado de emergencia al hospital.",
                CondicionPaciente: 5,
            }, transaction);
            yield transaction.commit();
            console.log("Incidente de colisión actualizado con todas las tablas creado exitosamente.");
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error al crear el incidente actualizado:", error);
        }
    });
}
