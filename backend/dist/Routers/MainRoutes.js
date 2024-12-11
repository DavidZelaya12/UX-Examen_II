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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mainRouter = (0, express_1.Router)();
// Ruta básica para probar la conexión a la base de datos
mainRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.sequelize.authenticate();
        res.send('Hello World! La conexión a la base de datos fue exitosa.');
    }
    catch (error) {
        console.error('Error conectando a PostgreSQL:', error);
        res.status(500).send('Error conectando a la base de datos');
    }
}));
mainRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Correo, Contrasena } = req.body;
        const user = yield database_1.Usuario.findOne({
            where: { Correo, Contrasena },
            include: [{
                    model: database_1.Empleado,
                    include: [database_1.Persona]
                }]
        });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const empleado = user.get('Empleado');
        const horaEntrada = empleado ? empleado.HoraEntrada : null;
        const horaSalida = empleado ? empleado.HoraSalida : null;
        const payload = {
            IDusuario: user.get('IDusuario'),
            IDEmpleado: user.get('IDEmpleado'),
            Correo: user.get('Correo'),
            TipoUsuario: user.get('TipoUsuario'),
            HoraEntrada: horaEntrada,
            HoraSalida: horaSalida,
            Nombre: empleado.Persona.Nombre,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login realizado de manera exitosa', token });
    }
    catch (error) {
        console.error('Error al hacer login:', error);
        res.status(500).send('Error al hacer login');
    }
}));
exports.default = mainRouter;
