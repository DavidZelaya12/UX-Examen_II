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
const express_1 = require("express");
const database_1 = require("../database");
;
const CompanionRouter = (0, express_1.Router)();
CompanionRouter.get('/get-companion-by-incident-id/:IDIncidente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente } = req.params;
        console.log(IDIncidente);
        if (!IDIncidente) {
            return res.status(400).send('Falta el ID del incidente');
        }
        const incident = yield database_1.Incidente.findOne({
            where: { IDIncidente }
        });
        if (!incident) {
            return res.status(404).send('No se encontró el incidente');
        }
        const IDAcompanante = incident.getDataValue('IDAcompanante');
        const companions = yield database_1.Acompanante.findOne({ where: { IDAcompanante } });
        if (companions == null) {
            return res.status(404).send('No hay acompañantes');
        }
        return res.status(200).json(companions);
    }
    catch (error) {
        console.error('Error al obtener acompañantes:', error);
        res.status(500).send('Error al obtener acompañantes');
    }
}));
CompanionRouter.post('/add-companion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Nombre, Parentesco } = req.body;
        if (!Nombre || !Parentesco) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const newCompanion = yield database_1.Acompanante.create({ Nombre, Parentesco });
        return res.status(200).json({ message: "Acompañante creado exitosamente", newCompanion });
    }
    catch (error) {
        console.error('Error al crear acompañante:', error);
        res.status(500).send('Error al crear acompañante');
    }
}));
exports.default = CompanionRouter;
