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
exports.crearIncidente1 = crearIncidente1;
const AuxFunctions_1 = require("./AuxFunctions");
const database_1 = require("../database");
function crearIncidente1() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield database_1.sequelize.transaction();
        try {
            const hospital = yield (0, AuxFunctions_1.crearHospital)("Hospital Leonardo Martinez", "Maternidad", transaction);
            const medico = yield (0, AuxFunctions_1.crearMedico)("Dra. Lopez", "Medico", null, hospital, transaction);
            const persona = yield (0, AuxFunctions_1.crearPersona)({
                No_Identidad: "0501-1999-12345",
                Nombre: "Ana González",
                Genero: false,
                Telefono: "8888-1234",
                FechaNacimiento: new Date(1999, 2, 10),
                Ocupacion: "Ama de Casa",
                Direccion: "Col. El Progreso",
                EstadoCivil: "C",
            }, transaction);
            const empleado = yield (0, AuxFunctions_1.crearEmpleado)(persona, "Paramedico", "pm", "07:00:00", "15:00:00", transaction);
            const ambulancia = yield (0, AuxFunctions_1.crearAmbulancia)("A-300", true, [empleado], transaction);
            const acompanante = yield (0, AuxFunctions_1.crearAcompanante)("Luis Gómez", "Esposo", transaction);
            const empleadoJorge = yield database_1.Empleado.findOne({
                where: { IDEmpleado: 2 },
            });
            const incidente = yield (0, AuxFunctions_1.crearIncidente)(persona, acompanante, empleadoJorge, "Col. El Progreso", "Trabajo de Parto", "Rojo", "Paciente en labor de parto con contracciones regulares cada 5 minutos.", "TrasladoSolamente", 3, ["Diarrea", "Asma"], ["Contracciones Regulares"], transaction);
            yield (0, AuxFunctions_1.registrarSalidaAmbulancia)(ambulancia, incidente, transaction);
            yield (0, AuxFunctions_1.registrarOxigeno)(incidente, {
                Uso: "Oxígeno por cánula orofacial",
                OxigenoLitro: 2,
                OxigenoTiempo: 20,
                OxigenoCanOrofa: true,
                OxigenoCollarCerv: false,
            }, transaction);
            yield (0, AuxFunctions_1.registrarGlascow)(incidente, {
                RespuestaVisual: "AbreEspontaneamente",
                RespuestaVerbal: "ConversaOrientado",
                RespuestaMotora: "ObedeceOrdenes",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteEfectosPersonales)(incidente, {
                Resguardo: true,
                Pol: false,
                Fam: true,
                Pers_Hospital: true,
                Otros: "Ropa del bebé y documentos personales.",
                PX: "Estable",
            }, transaction);
            yield (0, AuxFunctions_1.registrarSignosVitales)(incidente, {
                P_A: "120/80",
                FR: 20,
                FC: 90,
                SpO2: 97,
                Temp: 36.5,
                Glucosa: 100,
                UbicacionLesion: null,
                ImagenLesion: null,
            }, transaction);
            yield (0, AuxFunctions_1.registrarPupilas)(incidente, {
                OjoDerecho: "Ninguno",
                OjoIzquierdo: "Ninguno",
                Normales: true,
                Reactivas: true,
            }, transaction);
            yield (0, AuxFunctions_1.registrarEmbarazo)(incidente, {
                PartoEnAmbulancia: false,
                Gestacion: "38 semanas",
                NacidoVivo: true,
                AU: "32 cm",
                FUM: "2024-02-15",
                FPP: "2024-11-22",
                Sexo: "F",
                Placenta: true,
                HoraNacimiento: "09:00",
                Via: "Normal",
                Respuesta: "Llanto espontáneo",
                STV: true,
                Parto: "PartoNormal",
            }, transaction);
            yield (0, AuxFunctions_1.registrarPacienteChequeo)(incidente, {
                ExamenFisico: ["Paciente estable, en trabajo de parto"],
                Observaciones: "Contracciones regulares cada 5 minutos.",
                CondicionPaciente: 2,
            }, transaction);
            yield transaction.commit();
            console.log("Incidente de embarazo creado exitosamente.");
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error al crear el incidente de embarazo:", error);
        }
    });
}
