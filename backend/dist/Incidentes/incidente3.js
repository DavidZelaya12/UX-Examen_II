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
exports.crearIncidente3 = crearIncidente3;
const AuxFunctions_1 = require("./AuxFunctions");
const database_1 = require("../database");
function crearIncidente3() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield database_1.sequelize.transaction();
        try {
            const fechaAleatoria = (0, AuxFunctions_1.generarFechaAleatoria2024)();
            const hospital = yield (0, AuxFunctions_1.crearHospital)("Hospital Escuela Universitario", "Emergencias", transaction);
            const medico = yield (0, AuxFunctions_1.crearMedico)("Dr. Gomez", "Medico", null, hospital, transaction);
            const persona = yield (0, AuxFunctions_1.crearPersona)({
                No_Identidad: "0801-1987-67890",
                Nombre: "Roberto Mejía",
                Genero: true,
                Telefono: "8888-7777",
                FechaNacimiento: new Date(1987, 8, 24),
                Ocupacion: "Técnico en Mantenimiento",
                Direccion: "Col. La Sosa",
                EstadoCivil: "C",
            }, transaction);
            const empleado = yield (0, AuxFunctions_1.crearEmpleado)(persona, "Paramedico", "am", "06:00:00", "14:00:00", transaction);
            const ambulancia = yield (0, AuxFunctions_1.crearAmbulancia)("A-350", true, [empleado], transaction);
            const acompanante = yield (0, AuxFunctions_1.crearAcompanante)("María Mejía", "Hermana", transaction);
            const incidente = yield (0, AuxFunctions_1.crearIncidente)(persona, acompanante, empleado, "Col. La Sosa, edificio de bodegas", "Intoxicación por gases tóxicos", "Rojo", "Paciente expuesto a gases tóxicos mientras trabajaba en una bodega cerrada.", "TrasladoSolamente", 3, ["Sangrado Digestivo", "Asfixia"], ["Debilidad generalizada", "Pérdida de consciencia momentánea"], transaction, fechaAleatoria);
            yield (0, AuxFunctions_1.registrarSalidaAmbulancia)(ambulancia, incidente, transaction);
            yield (0, AuxFunctions_1.registrarOxigeno)(incidente, {
                Uso: "Oxígeno por mascarilla",
                OxigenoLitro: 5,
                OxigenoTiempo: 15,
                OxigenoCanOrofa: false,
                OxigenoCollarCerv: false,
            }, transaction);
            yield (0, AuxFunctions_1.registrarGlascow)(incidente, {
                RespuestaVisual: "AbreEstimuloVerbal",
                RespuestaVerbal: "PalabrasNoApropiadas",
                RespuestaMotora: "SeRetiraDelDolor",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteEfectosPersonales)(incidente, {
                Resguardo: true,
                Pol: false,
                Fam: true,
                Pers_Hospital: true,
                Otros: "Documentos personales y equipo de trabajo.",
                PX: "Critico",
            }, transaction);
            yield (0, AuxFunctions_1.registrarSignosVitales)(incidente, {
                P_A: "90/60",
                FR: 28,
                FC: 120,
                SpO2: 85,
                Temp: 36.0,
                Glucosa: 98,
                UbicacionLesion: null,
                ImagenLesion: null,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPupilas)(incidente, {
                OjoDerecho: "Contraido",
                OjoIzquierdo: "Contraido",
                Normales: false,
                Reactivas: true,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteChequeo)(incidente, {
                ExamenFisico: ["Paciente en estado crítico, con síntomas de intoxicación severa."],
                Observaciones: "Respuesta motora limitada, necesidad de soporte ventilatorio.",
                CondicionPaciente: 4,
            }, transaction);
            yield transaction.commit();
            console.log("Incidente de intoxicación por gases tóxicos creado exitosamente.");
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error al crear el incidente de intoxicación:", error);
        }
    });
}
