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
exports.AmbulanceRouter = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const database_2 = require("../database");
const AmbulanceRouter = (0, express_1.Router)();
exports.AmbulanceRouter = AmbulanceRouter;
AmbulanceRouter.get('/get-ambulance-by-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const salida = yield database_1.Salida_Ambulancia.findOne({ where: { IDIncidente: id } });
        if (salida == null) {
            return res.status(404).send('No se encontro ninguna salida de ambulancia para este incidente');
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { IDAmbulancia: salida.get('IDAmbulancia') } });
        if (ambulance == null) {
            return res.status(404).send('No se encontro ninguna ambulancia para este incidente');
        }
        return res.status(200).json(ambulance);
    }
    catch (error) {
        console.error('Error al obtener ambulancia:', error);
        res.status(500).send('Error al obtener ambulancia');
    }
}));
AmbulanceRouter.get('/get-ambulance-by-ambulance-id/:ambulanceid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ambulanceid } = req.params;
        if (!ambulanceid) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { IDAmbulancia: ambulanceid } });
        if (ambulance == null) {
            return res.status(404).send('No se encontró la ambulancia');
        }
        return res.status(200).json(ambulance);
    }
    catch (error) {
        console.error('Error al obtener ambulancia:', error);
        res.status(500).send('Error al obtener ambulancia');
    }
}));
AmbulanceRouter.post('/add-ambulance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Unidad, EnServicio } = req.body;
        if (!Unidad) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const newAmbulance = yield database_1.Ambulancia.create({ Unidad, EnServicio });
        return res.status(200).json({ message: "Ambulancia creada exitosamente", newAmbulance });
    }
    catch (error) {
        res.status(500).send('Error al crear ambulancia');
    }
}));
AmbulanceRouter.get('/ambulances', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ambulances = yield database_1.Ambulancia.findAll({
            where: {
                EnServicio: [true, false]
            }
        });
        if (ambulances.length === 0) {
            return res.status(404).send('No se encontraron ambulancias');
        }
        return res.status(200).json(ambulances);
    }
    catch (error) {
        console.error('Error al obtener ambulancias:', error);
        res.status(500).send('Error al obtener ambulancias');
    }
}));
AmbulanceRouter.put('/update-ambulance-Status/:Unidad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Unidad } = req.params;
        const { EnServicio } = req.body;
        if (EnServicio === undefined || !Unidad) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { Unidad } });
        if (!ambulance) {
            return res.status(404).send('Ambulancia no encontrada');
        }
        if (ambulance.get('EnServicio') === null) {
            return res.status(403).json('La ambulancia ya no se encuentra en servicio');
        }
        yield ambulance.update({ EnServicio: EnServicio });
        return res.status(200).json({ message: "Ambulancia actualizada exitosamente", ambulance });
    }
    catch (error) {
        console.warn('Error al actualizar ambulancia:', error);
        res.status(500).send('Error al actualizar ambulancia');
    }
}));
AmbulanceRouter.get('/get-km-by-ambulance/:Unidad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Unidad } = req.params;
        if (!Unidad) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { Unidad } });
        if (!ambulance) {
            return res.status(404).send('Ambulancia no encontrada');
        }
        const kmEntrada = yield database_1.Salida_Ambulancia.sum('KilometrajeEntrada', { where: { IDAmbulancia: ambulance.get('IDAmbulancia') } });
        const kmSalida = yield database_1.Salida_Ambulancia.sum('KilometrajeSalida', { where: { IDAmbulancia: ambulance.get('IDAmbulancia') } });
        const km = kmEntrada + kmSalida;
        return res.status(200).json({ km });
    }
    catch (error) {
        console.error('Error al obtener ambulancia:', error);
        res.status(500).send('Error al obtener ambulancia');
    }
}));
AmbulanceRouter.post('/Add-Ambulance-Exit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDAmbulancia, IDIncidente, KilometrajeSalida, KilometrajeEntrada, HoraSalida, HoraAbordaje, LlegadaHospital, HoraRegreso } = req.body;
        if (!IDAmbulancia || !IDIncidente || KilometrajeSalida === undefined || KilometrajeEntrada === undefined ||
            !HoraSalida || !HoraAbordaje || !LlegadaHospital || !HoraRegreso) {
            res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            return;
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { IDAmbulancia } });
        if (!ambulance) {
            return res.status(404).send('Ambulancia no encontrada');
        }
        const nuevaSalida = yield database_1.Salida_Ambulancia.create({
            IDAmbulancia,
            IDIncidente,
            KilometrajeSalida,
            KilometrajeEntrada,
            HoraSalida,
            HoraAbordaje,
            LlegadaHospital,
            HoraRegreso
        });
        return res.status(200).json({ message: "Salida de ambulancia creada exitosamente", nuevaSalida });
    }
    catch (error) {
        console.error('Error al crear salida de ambulancia:', error);
        res.status(500).send('Error al crear salida de ambulancia');
    }
}));
AmbulanceRouter.put('/Update-Ambulance-Exit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDAmbulancia, IDIncidente, KilometrajeSalida, KilometrajeEntrada, HoraSalida, HoraAbordaje, LlegadaHospital, HoraRegreso } = req.body;
        if (!IDAmbulancia || !IDIncidente || KilometrajeSalida === undefined || KilometrajeEntrada === undefined ||
            !HoraSalida || !HoraAbordaje || !LlegadaHospital || !HoraRegreso) {
            res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            return;
        }
        const salida = yield database_1.Salida_Ambulancia.findOne({
            where: { IDAmbulancia, IDIncidente }
        });
        if (!salida) {
            return res.status(404).send('Salida de ambulancia no encontrada');
        }
        yield salida.update({
            KilometrajeSalida,
            KilometrajeEntrada,
            HoraSalida,
            HoraAbordaje,
            LlegadaHospital,
            HoraRegreso
        });
        return res.status(200).json({ message: "Salida de ambulancia actualizada exitosamente", salida });
    }
    catch (error) {
        console.error('Error al crear salida de ambulancia:', error);
        res.status(500).send('Error al crear salida de ambulancia');
    }
}));
AmbulanceRouter.get('/get-ambulance-exit-by-id/:IDIncidente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente } = req.params;
        if (!IDIncidente) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const salida = yield database_1.Salida_Ambulancia.findOne({ where: { IDIncidente } });
        if (salida == null) {
            return res.status(404).send('No se encontro ninguna salida de ambulancia para este incidente');
        }
        return res.status(200).json(salida);
    }
    catch (error) {
        console.error('Error al obtener salida de ambulancia:', error);
        res.status(500).send('Error al obtener salida de ambulancia');
    }
}));
AmbulanceRouter.get('/get-ambulance-exit-by-ambulance/:IDAmbulancia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDAmbulancia } = req.params;
        if (!IDAmbulancia) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const salida = yield database_1.Salida_Ambulancia.findAll({ where: { IDAmbulancia } });
        if (salida.length === 0) {
            return res.status(404).send('No se encontro ninguna salida de ambulancia para esta ambulancia');
        }
        return res.status(200).json(salida);
    }
    catch (error) {
        console.error('Error al obtener salida de ambulancia:', error);
        res.status(500).send('Error al obtener salida de ambulancia');
    }
}));
AmbulanceRouter.get('/get-ambulance-employees', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Employees = yield database_1.Empleado.findAll({
            where: {
                TipoEmpleado: ['Auxiliar', 'Motorista']
            },
            include: [{
                    model: database_2.Persona,
                    attributes: ['No_Identidad', 'Nombre']
                }]
        });
        if (Employees.length === 0) {
            return res.status(404).send('No se encontraron empleados');
        }
        return res.status(200).json(Employees);
    }
    catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).send('Error al obtener los empleados');
    }
}));
AmbulanceRouter.get('/get-ambulance-employees-by-incident/:IDIncidente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente } = req.params;
        if (!IDIncidente) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const salida = yield database_1.Salida_Ambulancia.findOne({ where: { IDIncidente } });
        if (salida == null) {
            return res.status(404).send('No se encontró la salida de ambulancia');
        }
        const ambulance = yield database_1.Ambulancia.findOne({ where: { IDAmbulancia: salida.get('IDAmbulancia') } });
        if (ambulance == null) {
            return res.status(404).send('No se encontró la ambulancia');
        }
        const employees = yield database_1.PersonalAmbulancia.findAll({ where: { IDAmbulancia: ambulance.get('IDAmbulancia') }, include: [{ model: database_1.Empleado, include: [{ model: database_2.Persona, attributes: ['No_Identidad', 'Nombre'] }] }] });
        if (employees.length === 0) {
            return res.status(404).send('No se encontraron empleados');
        }
        return res.status(200).json(employees);
    }
    catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).send('Error al obtener empleados');
    }
}));
AmbulanceRouter.get('/get-ambulances', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ambulances = yield database_1.Ambulancia.findAll();
        if (ambulances.length === 0) {
            return res.status(404).send('No se encontraron ambulancias');
        }
        return res.status(200).json(ambulances);
    }
    catch (error) {
        console.error('Error al obtener ambulancias:', error);
        res.status(500).send('Error al obtener ambulancias');
    }
}));
