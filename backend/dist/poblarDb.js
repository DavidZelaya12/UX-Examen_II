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
exports.poblarBaseDeDatos = poblarBaseDeDatos;
const database_1 = require("./database");
const incidente1_1 = require("./Incidentes/incidente1");
const incidente2_1 = require("./Incidentes/incidente2");
const incidente3_1 = require("./Incidentes/incidente3");
const incidente4_1 = require("./Incidentes/incidente4");
const incidente5_1 = require("./Incidentes/incidente5");
function poblarBaseDeDatos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuariosExistentes = yield database_1.Usuario.count();
            const empleadosExistentes = yield database_1.Empleado.count();
            const personasExistentes = yield database_1.Persona.count();
            console.log("Usuarios:", usuariosExistentes);
            console.log("Empleados:", empleadosExistentes);
            console.log("Personas:", personasExistentes);
            if (usuariosExistentes === 0 && empleadosExistentes === 0) {
                const personas = [
                    {
                        No_Identidad: "0801199900001",
                        Nombre: "Erick Amaya",
                        Genero: true,
                        Telefono: "99999999",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199900002",
                        Nombre: "Jorge Paz",
                        Genero: true,
                        Telefono: "99999998",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199900003",
                        Nombre: "Claudio Agüero",
                        Genero: false,
                        Telefono: "99999997",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199900004",
                        Nombre: "Heyden Aldana",
                        Genero: true,
                        Telefono: "99999996",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'C'
                    },
                    {
                        No_Identidad: "0801199900005",
                        Nombre: "William Cole",
                        Genero: true,
                        Telefono: "99999995",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199900006",
                        Nombre: "David Zelaya",
                        Genero: true,
                        Telefono: "99999994",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199900007",
                        Nombre: "Daniel Flores",
                        Genero: true,
                        Telefono: "99999993",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Estudiante",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    }
                ];
                for (const personaData of personas) {
                    yield database_1.Persona.create(personaData);
                }
                const empleado1 = yield database_1.Empleado.create({
                    IDPersona: 1,
                    TipoEmpleado: "Medico",
                    TipoTurno: "am",
                    HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                    HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                });
                yield database_1.Usuario.create({
                    IDEmpleado: empleado1.getDataValue('IDEmpleado'),
                    Contrasena: "password",
                    Correo: "correo1@gmail.com",
                    TipoUsuario: "Administrador"
                });
                const empleado2 = yield database_1.Empleado.create({
                    IDPersona: 2,
                    TipoEmpleado: "Paramedico",
                    TipoTurno: "am",
                    HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                    HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                });
                yield database_1.Usuario.create({
                    IDEmpleado: empleado2.getDataValue('IDEmpleado'),
                    Contrasena: "password",
                    Correo: "correo2@gmail.com",
                    TipoUsuario: "Limitado"
                });
                const empleado3 = yield database_1.Empleado.create({
                    IDPersona: 3,
                    TipoEmpleado: "Otro",
                    TipoTurno: "am",
                    HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                    HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                });
                yield database_1.Usuario.create({
                    IDEmpleado: empleado3.getDataValue('IDEmpleado'),
                    Contrasena: "password",
                    Correo: "correo3@gmail.com",
                    TipoUsuario: "Consultor"
                });
                const personaparamedicoAdicional = yield database_1.Persona.create({
                    No_Identidad: "0801199900008",
                    Nombre: "Juan Perez",
                    Genero: true,
                    Telefono: "99999992",
                    FechaNacimiento: new Date(),
                    Ocupacion: "Estudiante",
                    Direccion: "San Pedro Sula",
                    EstadoCivil: 'S'
                });
                const empleado4 = yield database_1.Empleado.create({
                    IDPersona: personaparamedicoAdicional.getDataValue('IDPersona'),
                    TipoEmpleado: "Paramedico",
                    TipoTurno: "am",
                    HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                    HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                });
                yield database_1.Usuario.create({
                    IDEmpleado: empleado4.getDataValue('IDEmpleado'),
                    Contrasena: "password",
                    Correo: "correo4@gmail.com",
                    TipoUsuario: "Limitado"
                });
                for (let i = 4; i <= personas.length; i++) {
                    const empleado = yield database_1.Empleado.create({
                        IDPersona: i,
                        TipoEmpleado: "Otro",
                        TipoTurno: "pm",
                        HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                        HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                    });
                    yield database_1.Usuario.create({
                        IDEmpleado: empleado.get('IDEmpleado'),
                        Contrasena: "password",
                        Correo: `correo${i}@gmail.com`,
                        TipoUsuario: "Limitado"
                    });
                }
                const personasMotoristayAuxiliar = [
                    {
                        No_Identidad: "0801199500004",
                        Nombre: "Motorista",
                        Genero: true,
                        Telefono: "99999996",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Motorista",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199500005",
                        Nombre: "Auxiliar",
                        Genero: true,
                        Telefono: "99999995",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Auxiliar",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199500006",
                        Nombre: "Auxiliar",
                        Genero: false,
                        Telefono: "99999994",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Auxiliar",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    },
                    {
                        No_Identidad: "0801199500007",
                        Nombre: "Auxiliar",
                        Genero: true,
                        Telefono: "99999993",
                        FechaNacimiento: new Date(),
                        Ocupacion: "Auxiliar",
                        Direccion: "San Pedro Sula",
                        EstadoCivil: 'S'
                    }
                ];
                for (const personaData of personasMotoristayAuxiliar) {
                    yield database_1.Persona.create(personaData);
                }
                for (let i = 0; i < personasMotoristayAuxiliar.length; i++) {
                    const persona = personasMotoristayAuxiliar[i];
                    const empleado = yield database_1.Empleado.create({
                        IDPersona: i + personas.length + 1,
                        TipoEmpleado: persona.Ocupacion,
                        TipoTurno: "pm",
                        HoraEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                        HoraSalida: new Date().toLocaleTimeString('en-GB', { hour12: false })
                    });
                }
                yield (0, incidente1_1.crearIncidente1)();
                yield (0, incidente2_1.crearIncidente2)();
                yield (0, incidente3_1.crearIncidente3)();
                yield (0, incidente4_1.crearIncidente4)();
                yield (0, incidente5_1.crearIncidente5)();
                console.log("Base de datos inicializada con datos de prueba.");
            }
        }
        catch (error) {
            console.error("Error poblando la base de datos:", error);
        }
    });
}
