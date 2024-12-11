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
exports.crearIncidente4 = crearIncidente4;
const AuxFunctions_1 = require("./AuxFunctions");
const database_1 = require("../database");
function crearIncidente4() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield database_1.sequelize.transaction();
        try {
            const fechaAleatoria = (0, AuxFunctions_1.generarFechaAleatoria2024)(); // Generamos una fecha aleatoria
            const hospital = yield (0, AuxFunctions_1.crearHospital)("Hospital Escuela Universitario", "Cardiología", transaction);
            const medico = yield (0, AuxFunctions_1.crearMedico)("Dr. Rodríguez", "Medico", null, hospital, transaction);
            const persona = yield (0, AuxFunctions_1.crearPersona)({
                No_Identidad: "0801-1955-23456",
                Nombre: "Juan López",
                Genero: true,
                Telefono: "8888-6666",
                FechaNacimiento: new Date(1955, 3, 12),
                Ocupacion: "Jubilado",
                Direccion: "Col. Kennedy",
                EstadoCivil: "C",
            }, transaction);
            const empleado = yield (0, AuxFunctions_1.crearEmpleado)(persona, "Paramedico", "pm", "14:00:00", "22:00:00", transaction);
            const ambulancia = yield (0, AuxFunctions_1.crearAmbulancia)("A-120", true, [empleado], transaction);
            const acompanante = yield (0, AuxFunctions_1.crearAcompanante)("María López", "Esposa", transaction);
            const incidente = yield (0, AuxFunctions_1.crearIncidente)(persona, acompanante, empleado, "Col. Kennedy, Casa 32", "Ataque Cardíaco", "Rojo", "Paciente sufrió un ataque cardíaco en su domicilio, reportado como pérdida de consciencia momentánea.", "TrasladoSolamente", 2, ["Crisis Hipertensiva"], ["Dolor agudo en el pecho", "Sudoración excesiva"], transaction, fechaAleatoria);
            yield (0, AuxFunctions_1.registrarSalidaAmbulancia)(ambulancia, incidente, transaction);
            yield (0, AuxFunctions_1.registrarOxigeno)(incidente, {
                Uso: "Oxígeno suplementario por mascarilla",
                OxigenoLitro: 3,
                OxigenoTiempo: 20,
                OxigenoCanOrofa: false,
                OxigenoCollarCerv: false,
            }, transaction);
            yield (0, AuxFunctions_1.registrarGlascow)(incidente, {
                RespuestaVisual: "AbreEstimuloDoloroso",
                RespuestaVerbal: "ConversaDesorientado",
                RespuestaMotora: "LocalizaElDolor",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteEfectosPersonales)(incidente, {
                Resguardo: true,
                Pol: false,
                Fam: true,
                Pers_Hospital: true,
                Otros: "Documentos médicos previos y medicación del paciente.",
                PX: "Critico",
            }, transaction);
            yield (0, AuxFunctions_1.registrarSignosVitales)(incidente, {
                P_A: "80/50",
                FR: 25,
                FC: 120,
                SpO2: 90,
                Temp: 36.2,
                Glucosa: 95,
                UbicacionLesion: null,
                ImagenLesion: null,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPupilas)(incidente, {
                OjoDerecho: "Ninguno",
                OjoIzquierdo: "Ninguno",
                Normales: true,
                Reactivas: true,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteChequeo)(incidente, {
                ExamenFisico: ["Paciente con signos de hipotensión, respuesta limitada al estímulo verbal."],
                Observaciones: "Requiere atención inmediata en cardiología.",
                CondicionPaciente: 5,
            }, transaction);
            yield transaction.commit();
            console.log("Incidente de ataque cardíaco creado exitosamente.");
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error al crear el incidente de ataque cardíaco:", error);
        }
    });
}
