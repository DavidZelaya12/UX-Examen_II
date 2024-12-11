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
exports.generarFechaAleatoria2024 = generarFechaAleatoria2024;
exports.crearHospital = crearHospital;
exports.crearMedico = crearMedico;
exports.crearPersona = crearPersona;
exports.crearEmpleado = crearEmpleado;
exports.crearAmbulancia = crearAmbulancia;
exports.crearAcompanante = crearAcompanante;
exports.crearIncidente = crearIncidente;
exports.registrarSalidaAmbulancia = registrarSalidaAmbulancia;
exports.registrarOxigeno = registrarOxigeno;
exports.registrarGlascow = registrarGlascow;
exports.registrarSignosVitales = registrarSignosVitales;
exports.registrarPacienteChequeo = registrarPacienteChequeo;
exports.registrarPacienteEfectosPersonales = registrarPacienteEfectosPersonales;
exports.registrarPupilas = registrarPupilas;
exports.registrarEmbarazo = registrarEmbarazo;
const database_1 = require("../database");
function generarFechaAleatoria2024() {
    const inicio = new Date(2024, 0, 1); // 1 de enero de 2024
    const fin = new Date(2024, 11, 31); // 31 de diciembre de 2024
    return new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
}
function crearHospital(nombre, area, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.Hospital.create({
            NombreHospital: nombre,
            Area: area,
        }, { transaction });
    });
}
function crearMedico(nombre, personalSalud, firma, hospital, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const medico = yield database_1.Medico.create({
            nombre,
            PersonalSalud: personalSalud,
            Firma: firma,
        }, { transaction });
        yield database_1.Medico_Hospital.create({
            IDMedico: medico.getDataValue("IDMedico"),
            IDHospital: hospital.getDataValue("IDHospital"),
        }, { transaction });
        return medico;
    });
}
function crearPersona(datosPersona, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.Persona.create(datosPersona, { transaction });
    });
}
function crearEmpleado(persona, tipoEmpleado, tipoTurno, horaEntrada, horaSalida, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.Empleado.create({
            IDPersona: persona.getDataValue("IDPersona"),
            TipoEmpleado: tipoEmpleado,
            TipoTurno: tipoTurno,
            HoraEntrada: horaEntrada,
            HoraSalida: horaSalida,
        }, { transaction });
    });
}
function crearAmbulancia(unidad, enServicio, empleados, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const ambulancia = yield database_1.Ambulancia.create({
            Unidad: unidad,
            EnServicio: enServicio,
        }, { transaction });
        for (const empleado of empleados) {
            yield database_1.PersonalAmbulancia.create({
                IDAmbulancia: ambulancia.getDataValue("IDAmbulancia"),
                IDEmpleado: empleado.getDataValue("IDEmpleado"),
            }, { transaction });
        }
        return ambulancia;
    });
}
function crearAcompanante(nombre, parentesco, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.Acompanante.create({
            Nombre: nombre,
            Parentesco: parentesco,
        }, { transaction });
    });
}
function crearIncidente(persona_1, acompanante_1, empelado_1, lugar_1, tipoIncidente_1, prioridad_1, historia_1, tipoTraslado_1, material_1, problemas_1, traumas_1, transaction_1) {
    return __awaiter(this, arguments, void 0, function* (persona, acompanante, empelado, lugar, tipoIncidente, prioridad, historia, tipoTraslado, material, problemas, traumas, transaction, fechaIncidente = generarFechaAleatoria2024()) {
        return yield database_1.Incidente.create({
            IDPersona: persona.getDataValue("IDPersona"),
            IDAcompanante: acompanante.getDataValue("IDAcompanante"),
            IDEmpleado: empelado.getDataValue("IDEmpleado"),
            Enlace: "911",
            Reporta: "Automático",
            Fecha: fechaIncidente,
            Lugar: lugar,
            TipoIncidente: tipoIncidente,
            Prioridad: prioridad,
            HistoriaAccidente: historia,
            TipoTraslado: tipoTraslado,
            MaterialUtilizado: material,
            ProblemasMedicos: problemas,
            Traumas: traumas,
        }, { transaction });
    });
}
function registrarSalidaAmbulancia(ambulancia, incidente, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const horaSalida = "09:00:00";
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString().split("T")[0];
        const horaActual = fechaActual.toTimeString().split(" ")[0];
        return yield database_1.Salida_Ambulancia.create({
            IDAmbulancia: ambulancia.getDataValue("IDAmbulancia"),
            IDIncidente: incidente.getDataValue("IDIncidente"),
            KilometrajeSalida: 200,
            KilometrajeEntrada: 250,
            HoraSalida: horaSalida,
            Abordaje: `${fechaFormateada} ${horaActual}`,
            LLegadaHospital: `${fechaFormateada} ${horaActual}`,
            HoraRegreso: horaActual,
        }, { transaction });
    });
}
function registrarOxigeno(incidente, datosOxigeno, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.Oxigeno.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosOxigeno), { transaction });
    });
}
function registrarGlascow(incidente, datosGlascow, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.Glascow.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosGlascow), { transaction });
    });
}
function registrarSignosVitales(incidente, datosSignos, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.SignosVitales.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosSignos), { transaction });
    });
}
function registrarPacienteChequeo(incidente, datosChequeo, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.PacienteChequeo.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosChequeo), { transaction });
    });
}
function registrarPacienteEfectosPersonales(incidente, datosEfectos, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.PacienteEfectosPersonales.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosEfectos), { transaction });
    });
}
function registrarPupilas(incidente, datosPupilas, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.Pupilas.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosPupilas), { transaction });
    });
}
function registrarEmbarazo(incidente, datosEmbarazo, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.sequelize.models.Embarazo.create(Object.assign({ IDIncidente: incidente.getDataValue("IDIncidente") }, datosEmbarazo), { transaction });
    });
}
