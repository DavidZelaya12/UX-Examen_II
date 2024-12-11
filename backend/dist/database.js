"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescargoResponsabilidad = exports.Oxigeno = exports.Glascow = exports.PacienteEfectosPersonales = exports.Hospital = exports.SignosVitales = exports.Embarazo = exports.Pupilas = exports.PacienteChequeo = exports.Medico_Hospital = exports.Medico = exports.PersonalAmbulancia = exports.Salida_Ambulancia = exports.Ambulancia = exports.Incidente = exports.Acompanante = exports.Usuario = exports.Empleado = exports.Persona = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = process.env.DATABASE_URL
    ? new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
    })
    : new sequelize_1.Sequelize(process.env.PGDATABASE || '', process.env.PGUSER || '', process.env.PGPASSWORD || '', {
        host: process.env.PGHOST || 'localhost',
        dialect: 'postgres',
        port: parseInt(process.env.PGPORT || '5433', 10),
    });
exports.Persona = exports.sequelize.define("Persona", {
    IDPersona: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    No_Identidad: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true
    },
    Nombre: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    Genero: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: true
    },
    Telefono: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    FechaNacimiento: {
        type: sequelize_1.DataTypes.DATE, allowNull: true //No seria mejor poner fecha de nacimiento?
    },
    Ocupacion: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    Direccion: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    EstadoCivil: {
        type: sequelize_1.DataTypes.ENUM('S', 'UL', 'C', 'V', 'G'), allowNull: true
    }
}, { freezeTableName: true });
exports.Empleado = exports.sequelize.define("Empleado", {
    IDEmpleado: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    IDPersona: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Persona',
            key: 'IDPersona'
        }
    },
    TipoEmpleado: {
        type: sequelize_1.DataTypes.ENUM('Motorista', 'Paramedico', 'Auxiliar', 'Medico', 'Otro'), allowNull: false
    },
    TipoTurno: {
        type: sequelize_1.DataTypes.ENUM('am', 'pm'), allowNull: false
    },
    HoraEntrada: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    },
    HoraSalida: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Usuario = exports.sequelize.define("Usuario", {
    IDusuario: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    IDEmpleado: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Empleado',
            key: 'IDEmpleado'
        }
    },
    Contrasena: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    Correo: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    TipoUsuario: {
        type: sequelize_1.DataTypes.ENUM('Administrador', 'Limitado', 'Consultor'), allowNull: false //Consulta: no seria mejor guardar el Admin como un campo nulo?(Asi internamente se sabra nada mas)
    },
    Privilegios: {
        type: sequelize_1.DataTypes.JSON, allowNull: true
    },
    Activo: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.Acompanante = exports.sequelize.define("Acompanante", {
    IDAcompanante: {
        type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    Nombre: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    Parentesco: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    }
}, { freezeTableName: true });
exports.Incidente = exports.sequelize.define("Incidente", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    IDPersona: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Persona',
            key: 'IDPersona'
        }
    },
    IDAcompanante: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true,
        references: {
            model: 'Acompanante',
            key: 'IDAcompanante'
        }
    },
    IDEmpleado: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Empleado',
            key: 'IDEmpleado'
        }
    },
    Enlace: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    Reporta: {
        type: sequelize_1.DataTypes.STRING, allowNull: true //??
    },
    Fecha: {
        type: sequelize_1.DataTypes.DATE, allowNull: false
    },
    Lugar: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false
    },
    TipoIncidente: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    Prioridad: {
        type: sequelize_1.DataTypes.ENUM("Verde", "Amarillo", "Rojo", "Negro"), allowNull: false
    },
    HistoriaAccidente: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false
    },
    TipoTraslado: {
        type: sequelize_1.DataTypes.ENUM("TrasladoSolamente", "TrasladoInnecesario", "TransporteInncesario", "TransporteRehusado", "TrasladoVehiculoOficial", "TrasladoFueraDeLaCiudad", "FalsaAlarma"),
        allowNull: false
    },
    MaterialUtilizado: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false
    },
    ProblemasMedicos: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT), allowNull: false
    },
    Traumas: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT), allowNull: false
    },
    FirmaResponsable: {
        type: sequelize_1.DataTypes.BLOB, allowNull: true, defaultValue: null
    },
    IDMedico: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true,
        references: {
            model: 'Medico',
            key: 'IDMedico'
        }
    },
    UbicacionLesion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ImagenLesion: {
        type: sequelize_1.DataTypes.BLOB,
        allowNull: true
    }
}, { freezeTableName: true, timestamps: false });
exports.Ambulancia = exports.sequelize.define("Ambulancia", {
    IDAmbulancia: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    Unidad: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    EnServicio: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: true
    }
}, {
    freezeTableName: true, timestamps: false
});
exports.Salida_Ambulancia = exports.sequelize.define("Salida_Ambulancia", {
    IDSalida: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    IDAmbulancia: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ambulancia',
            key: 'IDAmbulancia'
        }
    },
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    KilometrajeSalida: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false
    },
    KilometrajeEntrada: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false
    },
    HoraSalida: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    },
    Abordaje: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    },
    LLegadaHospital: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    },
    HoraRegreso: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.PersonalAmbulancia = exports.sequelize.define("PersonalAmbulancia", {
    IDAmbulancia: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ambulancia',
            key: 'IDAmbulancia'
        }
    },
    IDEmpleado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Empleado',
            key: 'IDEmpleado'
        }
    }
}, { freezeTableName: true });
exports.Medico = exports.sequelize.define("Medico", {
    IDMedico: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    PersonalSalud: {
        type: sequelize_1.DataTypes.ENUM("Enfermera", "Medico", "Auxiliar", "Otro"), allowNull: false
    },
    Firma: {
        type: sequelize_1.DataTypes.BLOB, allowNull: true
    }
}, { freezeTableName: true });
exports.Medico_Hospital = exports.sequelize.define("Medico_Hospital", {
    IDMedico: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Medico',
            key: 'IDMedico'
        }
    },
    IDHospital: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Hospital',
            key: 'IDHospital'
        }
    }
}, { freezeTableName: true });
exports.PacienteChequeo = exports.sequelize.define("PacienteChequeo", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    ExamenFisico: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
        allowNull: true
    },
    Observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    CondicionPaciente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, { freezeTableName: true });
exports.Pupilas = exports.sequelize.define("Pupilas", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    OjoDerecho: {
        type: sequelize_1.DataTypes.ENUM('Dilatado', 'Contraido', 'Ninguno'), allowNull: false
    },
    OjoIzquierdo: {
        type: sequelize_1.DataTypes.ENUM('Dilatado', 'Contraido', 'Ninguno'), allowNull: false
    },
    Normales: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    },
    Reactivas: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    }
}, { freezeTableName: true });
exports.Embarazo = exports.sequelize.define("Embarazo", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    PartoEnAmbulancia: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    },
    Gestacion: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    NacidoVivo: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    },
    AU: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    FUM: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    FPP: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    Sexo: {
        type: sequelize_1.DataTypes.CHAR, allowNull: false
    },
    Placenta: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    },
    HoraNacimiento: {
        type: sequelize_1.DataTypes.TIME, allowNull: false
    },
    Via: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    Respuesta: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    STV: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false
    },
    Parto: {
        type: sequelize_1.DataTypes.ENUM("Aborto", "PartoNormal", "PartoAnormal"), allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.SignosVitales = exports.sequelize.define("SignosVitales", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    P_A: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    FR: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    },
    FC: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    },
    SpO2: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    },
    Temp: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    },
    Glucosa: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    }
}, { freezeTableName: true, timestamps: false });
exports.Hospital = exports.sequelize.define("Hospital", {
    IDHospital: {
        type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    NombreHospital: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    Area: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.PacienteEfectosPersonales = exports.sequelize.define("PacienteEfectosPersonales", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    Resguardo: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: true //No se que es esto
    },
    Pol: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: true //No se que es esto
    },
    Fam: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: true //No se que es esto
    },
    Pers_Hospital: {
        type: sequelize_1.DataTypes.BOOLEAN, allowNull: false //Consulta: a que refiere esto?
    },
    Otros: {
        type: sequelize_1.DataTypes.STRING, allowNull: true
    },
    PX: {
        type: sequelize_1.DataTypes.ENUM('Estable', 'Inestable', 'PotInestable', 'Critico', 'Fallecido'), allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.Glascow = exports.sequelize.define("Glascow", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    RespuestaVisual: {
        type: sequelize_1.DataTypes.ENUM('NuncaAbreLosOjos', 'AbreEstimuloDoloroso', 'AbreEstimuloVerbal', 'AbreEspontaneamente'),
        allowNull: false
    },
    RespuestaVerbal: {
        type: sequelize_1.DataTypes.ENUM('NoResponde', 'SonidoImcomprensible', 'PalabrasNoApropiadas', 'ConversaDesorientado', 'ConversaOrientado'),
        allowNull: false
    },
    RespuestaMotora: {
        type: sequelize_1.DataTypes.ENUM('NoResponde', 'RespuestaDescerebracion', 'RespuestaDescortizacion', 'SeRetiraDelDolor', 'LocalizaElDolor', 'ObedeceOrdenes'),
        allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.Oxigeno = exports.sequelize.define("Oxigeno", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    Uso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    OxigenoLitro: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    },
    OxigenoTiempo: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    },
    OxigenoCanOrofa: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    OxigenoCollarCerv: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, { freezeTableName: true, timestamps: false });
exports.DescargoResponsabilidad = exports.sequelize.define("DescargoResponsabilidad", {
    IDIncidente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Incidente',
            key: 'IDIncidente'
        }
    },
    IDusuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'IDusuario'
        }
    },
    Fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    Lugar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    Firma: {
        type: sequelize_1.DataTypes.BLOB,
        allowNull: true
    }
}, { freezeTableName: true, timestamps: false });
//RELACIONES
exports.Empleado.hasOne(exports.Usuario, { foreignKey: 'IDEmpleado' });
exports.Usuario.belongsTo(exports.Empleado, { foreignKey: 'IDEmpleado' });
exports.Persona.hasOne(exports.Empleado, { foreignKey: 'IDPersona' });
exports.Empleado.belongsTo(exports.Persona, { foreignKey: 'IDPersona' });
exports.Incidente.hasOne(exports.Glascow, { foreignKey: 'IDIncidente' });
exports.Glascow.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.Embarazo, { foreignKey: 'IDIncidente' });
exports.Embarazo.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.Oxigeno, { foreignKey: 'IDIncidente' });
exports.Oxigeno.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.PacienteEfectosPersonales, { foreignKey: 'IDIncidente' });
exports.PacienteEfectosPersonales.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.PacienteChequeo, { foreignKey: 'IDIncidente' });
exports.PacienteChequeo.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.SignosVitales, { foreignKey: 'IDIncidente' });
exports.SignosVitales.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.Pupilas, { foreignKey: 'IDIncidente' });
exports.Pupilas.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Incidente.hasOne(exports.Salida_Ambulancia, { foreignKey: 'IDIncidente' });
exports.Salida_Ambulancia.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Ambulancia.hasMany(exports.Salida_Ambulancia, { foreignKey: 'IDAmbulancia' });
exports.Salida_Ambulancia.belongsTo(exports.Ambulancia, { foreignKey: 'IDAmbulancia' });
exports.Medico.hasMany(exports.Medico_Hospital, { foreignKey: 'IDMedico' });
exports.Medico_Hospital.belongsTo(exports.Medico, { foreignKey: 'IDMedico' });
exports.Hospital.hasMany(exports.Medico_Hospital, { foreignKey: 'IDHospital' });
exports.Medico_Hospital.belongsTo(exports.Hospital, { foreignKey: 'IDHospital' });
exports.Persona.hasMany(exports.Incidente, { foreignKey: 'IDPersona' });
exports.Incidente.belongsTo(exports.Persona, { foreignKey: 'IDPersona' });
exports.Acompanante.hasMany(exports.Incidente, { foreignKey: 'IDAcompanante' });
exports.Incidente.belongsTo(exports.Acompanante, { foreignKey: 'IDAcompanante' });
exports.Ambulancia.hasMany(exports.PersonalAmbulancia, { foreignKey: 'IDAmbulancia' });
exports.PersonalAmbulancia.belongsTo(exports.Ambulancia, { foreignKey: 'IDAmbulancia' });
exports.PersonalAmbulancia.hasMany(exports.Empleado, { foreignKey: 'IDEmpleado' });
exports.Empleado.belongsTo(exports.PersonalAmbulancia, { foreignKey: 'IDEmpleado' });
exports.Incidente.hasOne(exports.DescargoResponsabilidad, { foreignKey: 'IDIncidente' });
exports.DescargoResponsabilidad.belongsTo(exports.Incidente, { foreignKey: 'IDIncidente' });
exports.Empleado.hasMany(exports.Incidente, { foreignKey: 'IDEmpleado' });
exports.Incidente.belongsTo(exports.Empleado, { foreignKey: 'IDEmpleado' });
exports.Usuario.hasMany(exports.DescargoResponsabilidad, { foreignKey: 'IDusuario' });
exports.DescargoResponsabilidad.belongsTo(exports.Usuario, { foreignKey: 'IDusuario' });
