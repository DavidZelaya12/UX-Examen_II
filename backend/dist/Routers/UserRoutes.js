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
const database_1 = require("../database");
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const UserRouter = (0, express_1.Router)();
UserRouter.get("/employees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield database_1.Empleado.findAll({
            include: [
                {
                    model: database_1.Persona,
                    attributes: ["No_Identidad", "Nombre"],
                },
            ],
        });
        if (!employees.length) {
            return res.status(404).send("No hay empleados");
        }
        res.status(200).json(employees);
    }
    catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).send("Error al obtener empleados");
    }
}));
UserRouter.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield database_1.Usuario.findAll({
            attributes: ["IDusuario", "Correo", "TipoUsuario"],
            include: [
                {
                    model: database_1.Empleado,
                    include: [database_1.Persona],
                },
            ],
        });
        if (!users.length) {
            return res.status(404).send("No hay usuarios");
        }
        return res.status(200).json({ message: "Usuarios:", users });
    }
    catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error al obtener usuarios");
    }
}));
UserRouter.post("/add-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDEmpleado, Contrasena, Correo, TipoUsuario } = req.body;
        if (!IDEmpleado || !Contrasena || !Correo || TipoUsuario === undefined) {
            console.warn(req.body);
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newUser = yield database_1.Usuario.create({
            IDEmpleado,
            Contrasena,
            Correo,
            TipoUsuario,
        });
        return res
            .status(200)
            .json({ message: "Usuario creado exitosamente", newUser });
    }
    catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).send("Error al crear usuario");
    }
}));
UserRouter.post("/add-employee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDPersona, TipoEmpleado, TipoTurno, HoraEntrada, HoraSalida } = req.body;
        if (!IDPersona ||
            !TipoEmpleado ||
            !TipoTurno ||
            !HoraEntrada ||
            !HoraSalida) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newEmployee = yield database_1.Empleado.create({
            IDPersona,
            TipoEmpleado,
            TipoTurno,
            HoraEntrada,
            HoraSalida,
        });
        return res
            .status(200)
            .json({ message: "Empleado creado exitosamente", newEmployee });
    }
    catch (error) {
        console.error("Error al crear empleado:", error);
        res.status(500).send("Error al crear empleado");
    }
}));
UserRouter.post("/add-person", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { No_Identidad, Nombre, Genero, Telefono, FechaNacimiento, Ocupacion, Direccion, EstadoCivil, } = req.body;
    const NuevoGenero = Genero === "Masculino" ? true : false;
    if (!No_Identidad ||
        !Nombre ||
        typeof Genero === "undefined" ||
        !FechaNacimiento ||
        !Ocupacion ||
        !Direccion ||
        !EstadoCivil) {
        console.warn("Campos enviados en el request:", req.body); // Log para ver los datos recibidos
        return res.status(400).send("Faltan campos obligatorios");
    }
    try {
        const newPerson = yield database_1.Persona.create({
            No_Identidad,
            Nombre,
            NuevoGenero,
            Telefono,
            FechaNacimiento,
            Ocupacion,
            Direccion,
            EstadoCivil,
        });
        return res
            .status(200)
            .json({ message: "Persona creada exitosamente", newPerson });
    }
    catch (error) {
        console.error("Error al crear persona:", error);
        res.status(500).send("Error al crear persona");
    }
}));
UserRouter.get("/persons", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const persons = yield database_1.Persona.findAll();
        if (!persons.length) {
            return res.status(404).send("No hay personas");
        }
        res.status(200).json(persons);
    }
    catch (error) {
        console.error("Error al obtener personas:", error);
        res.status(500).send("Error al obtener personas");
    }
}));
UserRouter.get("/get-persons-not-employees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const persons = yield database_1.sequelize.query('SELECT * FROM "Persona" WHERE "IDPersona" NOT IN (SELECT "IDPersona" FROM "Empleado")', { type: sequelize_1.QueryTypes.SELECT });
        if (!persons.length) {
            return res.status(404).send("No hay personas que no sean empleados");
        }
        res.status(200).json(persons);
    }
    catch (error) {
        console.error("Error al obtener personas que no son empleados:", error);
        res.status(500).send("Error al obtener personas que no son empleados");
    }
}));
UserRouter.put("/update-person-by-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDPersona, No_Identidad, Nombre } = req.body;
        const person = yield database_1.Persona.findByPk(IDPersona);
        if (!person) {
            return res.status(404).send("Persona no encontrada");
        }
        yield person.update({ No_Identidad, Nombre });
        return res
            .status(200)
            .json({ message: "Persona actualizada exitosamente", person });
    }
    catch (error) {
        console.error("Error al actualizar persona:", error);
        res.status(500).send("Error al actualizar persona");
    }
}));
/*
UserRouter.put('/update-person-by-id', async (req: Request, res: Response) => {
    // Al menos uno de estos IDs debe estar al hacer update a cualesquiera datos que se pasen.
    const { IDPersona, No_Identidad, ...updateFields } = req.body;
    if (!IDPersona && !No_Identidad) {
        return res.status(400).send('Debe proporcionar ya sea un ID de la Persona o un Número de Identidad');
    }
    try {
        const person = await Persona.findOne({
            where: IDPersona ? { IDPersona } : { No_Identidad }
        });
        if (!person) {
            return res.status(404).send('Esta persona no fue encontrada');
        }
        await person.update(updateFields);
        return res.status(200).json({ message: 'La información de la persona fue actualizada exitosamente', person });
    } catch (error) {
        console.error('Error al actualizar persona:', error);
        res.status(500).send('Error al actualizar la información de la persona');
    }
});
*/
//! Ruta para obtener una persona por su ID
UserRouter.get("/get-person-by-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const person = yield database_1.Persona.findByPk(id);
        if (!person) {
            return res.status(404).send("Persona no encontrada");
        }
        return res.status(200).json(person);
    }
    catch (error) {
        console.error("Error al obtener persona:", error);
        res.status(500).send("Error al obtener persona");
    }
}));
UserRouter.get("/get-user-by-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield database_1.Usuario.findByPk(id, {
            include: [
                {
                    model: database_1.Empleado,
                    include: [database_1.Persona],
                },
            ],
        });
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.status(200).json({ message: "Usuario:", user });
    }
    catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).send("Error al obtener usuario");
    }
}));
UserRouter.put("/update-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { persona, empleado, usuario } = req.body;
        // Obtener el usuario
        const user = yield database_1.Usuario.findByPk(id);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        // Actualizar usuario
        yield user.update({
            Contrasena: usuario.Contrasena,
            Correo: usuario.Correo,
            TipoUsuario: usuario.TipoUsuario,
        });
        // Obtener el empleado
        const employee = yield database_1.Empleado.findOne({
            where: { IDEmpleado: user.get("IDEmpleado") },
        });
        if (!employee) {
            return res.status(404).send("Empleado no encontrado");
        }
        // Actualizar empleado
        yield employee.update({
            TipoEmpleado: empleado.TipoEmpleado,
            TipoTurno: empleado.TipoTurno,
            HoraEntrada: empleado.HoraEntrada,
            HoraSalida: empleado.HoraSalida,
        });
        // Obtener la persona
        const person = yield database_1.Persona.findOne({
            where: { IDPersona: employee.get("IDPersona") },
        });
        if (!person) {
            return res.status(404).send("Persona no encontrada");
        }
        // Actualizar persona
        yield person.update({
            No_Identidad: persona.No_Identidad,
            Nombre: persona.Nombre,
            Genero: persona.Genero,
            Telefono: persona.Telefono,
            FechaNacimiento: persona.FechaNacimiento,
            Ocupacion: persona.Ocupacion,
            Direccion: persona.Direccion,
            EstadoCivil: persona.EstadoCivil,
        });
        // Consultar datos actualizados
        const updatedUser = yield database_1.Usuario.findByPk(id, {
            include: [
                {
                    model: database_1.Empleado,
                    include: [database_1.Persona],
                },
            ],
        });
        return res.status(200).json({
            message: "Usuario modificado exitosamente",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).send("Error al actualizar usuario");
    }
}));
UserRouter.delete("/delete-user/:IDusuario", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDusuario } = req.params;
        // Buscar el usuario por su ID
        const user = yield database_1.Usuario.findOne({ where: { IDusuario } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Eliminar el usuario
        yield user.destroy();
        return res
            .status(200)
            .json({ message: "Usuario eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
}));
// Crear usuario, empleado y persona en una sola transacción
UserRouter.post("/create-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction(); // Crear una transacción
    try {
        const { persona, empleado, usuario } = req.body;
        // Crear Persona
        const newPerson = (yield database_1.Persona.create(persona, {
            transaction: t,
        }));
        // Crear Empleado con el ID de la Persona creada
        const newEmployee = (yield database_1.Empleado.create(Object.assign(Object.assign({}, empleado), { IDPersona: newPerson.IDPersona }), { transaction: t }));
        // Crear Usuario con el ID del Empleado creado
        const newUser = (yield database_1.Usuario.create(Object.assign(Object.assign({}, usuario), { IDEmpleado: newEmployee.IDEmpleado }), { transaction: t }));
        // Confirmar transacción
        yield t.commit();
        return res.status(200).json({
            message: "Usuario, empleado y persona creados exitosamente",
            newPerson,
            newEmployee,
            newUser,
        });
    }
    catch (error) {
        // Revertir transacción en caso de error
        yield t.rollback();
        console.error("Error al crear usuario:", error);
        res.status(500).send("Error al crear usuario, empleado y persona");
    }
}));
exports.default = UserRouter;
