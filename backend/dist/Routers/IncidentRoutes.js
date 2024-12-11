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
const IncidentRouter = (0, express_1.Router)();
IncidentRouter.get("/get-incidents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        // Obtener incidentes con la información de la Persona relacionada
        const incidents = yield database_1.Incidente.findAll({
            include: [
                {
                    model: database_1.Persona,
                    attributes: ["No_Identidad", "Nombre"],
                },
            ],
            transaction: t, // Ejecutar la consulta dentro de la transacción
        });
        yield t.commit(); // Confirmar transacción
        return res.status(200).json(incidents); // Enviar datos al frontend
    }
    catch (error) {
        yield t.rollback(); // Revertir la transacción en caso de error
        console.error("Error al obtener incidentes:", error);
        res.status(500).send("Error al obtener incidentes");
    }
}));
IncidentRouter.get("/get-incident-by-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const incident = yield database_1.Incidente.findByPk(id, {
            include: [
                {
                    model: database_1.Persona,
                    attributes: ["No_Identidad", "Nombre"],
                },
            ],
        });
        if (!incident) {
            return res.status(404).send("Incidente no encontrado");
        }
        return res.status(200).json(incident);
    }
    catch (error) {
        console.error("Error al obtener incidente:", error);
        res.status(500).send("Error al obtener incidente");
    }
}));
IncidentRouter.put("/update-incident/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { IDPersona, IDAcompanante, Reporta, Fecha, Lugar, TipoIncidente, Prioridad, HistoriaAccidente, TipoTraslado, MaterialUtilizado, ProblemasMedicos, Traumas, } = req.body;
        const incident = yield database_1.Incidente.findByPk(id);
        if (!incident) {
            return res.status(404).send("Incidente no encontrado");
        }
        yield incident.update({
            IDPersona,
            IDAcompanante,
            Reporta,
            Fecha,
            Lugar,
            TipoIncidente,
            Prioridad,
            HistoriaAccidente,
            TipoTraslado,
            MaterialUtilizado,
            ProblemasMedicos,
            Traumas,
        });
        return res
            .status(200)
            .json({ message: "Incidente actualizado exitosamente", incident });
    }
    catch (error) {
        console.error("Error al actualizar incidente:", error);
        res.status(500).send("Error al actualizar incidente");
    }
}));
IncidentRouter.get("/get-vital-signals-by-incident-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vitalSignals = yield database_1.SignosVitales.findOne({
            where: { IDIncidente: id },
        });
        return res.status(200).json(vitalSignals);
    }
    catch (error) {
        console.error("Error al obtener signos vitales:", error);
        res.status(500).send("Error al obtener signos vitales");
    }
}));
IncidentRouter.post("/add-vital-signals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, FrecuenciaCardiaca, FrecuenciaRespiratoria, TensionArterial, Temperatura, SaturacionOxigeno, Glucometria, EscalaDolor, } = req.body;
        if (!IDIncidente ||
            !FrecuenciaCardiaca ||
            !FrecuenciaRespiratoria ||
            !TensionArterial ||
            !Temperatura ||
            !SaturacionOxigeno ||
            !Glucometria ||
            !EscalaDolor) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newVitalSignals = yield database_1.SignosVitales.create({
            IDIncidente,
            FrecuenciaCardiaca,
            FrecuenciaRespiratoria,
            TensionArterial,
            Temperatura,
            SaturacionOxigeno,
            Glucometria,
            EscalaDolor,
        });
        return res.status(200).json({
            message: "Signos vitales creados exitosamente",
            newVitalSignals,
        });
    }
    catch (error) {
        res.status(500).send("Error al crear signos vitales");
    }
}));
IncidentRouter.get("/get-oxygen-by-incident-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const oxygen = yield database_1.Oxigeno.findOne({ where: { IDIncidente: id } });
        if (oxygen == null) {
            return res
                .status(404)
                .send("No se encontro ningun oxigeno para este incidente");
        }
        return res.status(200).json(oxygen);
    }
    catch (error) {
        console.error("Error al obtener oxigeno:", error);
        res.status(500).send("Error al obtener oxigeno");
    }
}));
IncidentRouter.post("/add-oxygen", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, Uso, OxigenoLitros, OxigenoCanOrofa, OxigenoTiempo, OxigenoCollarCerv, } = req.body;
        if (!IDIncidente ||
            !Uso ||
            !OxigenoLitros ||
            !OxigenoCanOrofa ||
            !OxigenoTiempo ||
            !OxigenoCollarCerv) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newOxygen = yield database_1.Oxigeno.create({
            IDIncidente,
            Uso,
            OxigenoLitros,
            OxigenoCanOrofa,
            OxigenoTiempo,
            OxigenoCollarCerv,
        });
        return res
            .status(200)
            .json({ message: "Oxigeno creado exitosamente", newOxygen });
    }
    catch (error) {
        res.status(500).send("Error al crear oxigeno");
    }
}));
IncidentRouter.get("/get-glascow-by-incident-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const glascow = yield database_1.Glascow.findOne({ where: { IDIncidente: id } });
        if (glascow == null) {
            return res
                .status(404)
                .send("No se encontro ningun glascow para este incidente");
        }
        return res.status(200).json(glascow);
    }
    catch (error) {
        console.error("Error al obtener glasgow:", error);
        res.status(500).send("Error al obtener glasgow");
    }
}));
IncidentRouter.post("/add-glascow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, RespuestaMotora, RespuestaVerbal, RespuestaVisual } = req.body;
        if (!IDIncidente ||
            !RespuestaMotora ||
            !RespuestaVerbal ||
            !RespuestaVisual) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newGlasgow = yield database_1.Glascow.create({
            IDIncidente,
            RespuestaMotora,
            RespuestaVerbal,
            RespuestaVisual,
        });
        return res
            .status(200)
            .json({ message: "Glasgow creado exitosamente", newGlasgow });
    }
    catch (error) {
        res.status(500).send("Error al crear glasgow");
    }
}));
IncidentRouter.get("/get-patient-personal-effects-by-incident-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const patientPersonalEffects = yield database_1.PacienteEfectosPersonales.findOne({
            where: { IDIncidente: id },
        });
        if (patientPersonalEffects == null) {
            return res
                .status(404)
                .send("No se encontro ningun efecto personal para este incidente");
        }
        return res.status(200).json(patientPersonalEffects);
    }
    catch (error) {
        console.error("Error al obtener efectos personales del paciente:", error);
        res.status(500).send("Error al obtener efectos personales del paciente");
    }
}));
IncidentRouter.post("/add-patient-personal-effects", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, Resguardo, Pol, Fam, Pers_Hospital, Otros, PX } = req.body;
        if (!IDIncidente ||
            !Resguardo ||
            !Pol ||
            !Fam ||
            !Pers_Hospital ||
            !Otros ||
            !PX) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newPatientPersonalEffects = yield database_1.PacienteEfectosPersonales.create({
            IDIncidente,
            Resguardo,
            Pol,
            Fam,
            Pers_Hospital,
            Otros,
            PX,
        });
        return res.status(200).json({
            message: "Efectos personales del paciente creados exitosamente",
            newPatientPersonalEffects,
        });
    }
    catch (error) {
        res.status(500).send("Error al crear efectos personales del paciente");
    }
}));
IncidentRouter.get("/get-pupils-by-incident-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const pupils = yield database_1.Pupilas.findOne({ where: { IDIncidente: id } });
        if (pupils == null) {
            return res
                .status(404)
                .send("No se encontro ninguna pupila para este incidente");
        }
        return res.status(200).json(pupils);
    }
    catch (error) {
        console.error("Error al obtener pupilas:", error);
        res.status(500).send("Error al obtener pupilas");
    }
}));
IncidentRouter.post("/add-pupils", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, OjoDerecho, OjoIzquierdo, Normales, Reactivas } = req.body;
        if (!IDIncidente ||
            !OjoDerecho ||
            !OjoIzquierdo ||
            !Normales ||
            !Reactivas) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newPupils = yield database_1.Pupilas.create({
            IDIncidente,
            OjoDerecho,
            OjoIzquierdo,
            Normales,
            Reactivas,
        });
        return res
            .status(200)
            .json({ message: "Pupilas creadas exitosamente", newPupils });
    }
    catch (error) {
        res.status(500).send("Error al crear pupilas");
    }
}));
IncidentRouter.get("/get-pregnancy-by-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const pregnancy = yield database_1.Embarazo.findOne({ where: { IDIncidente: id } });
        if (!pregnancy) {
            return res
                .status(404)
                .send("No se encontro ningun embarazo para este incidente");
        }
        return res.status(200).json(pregnancy);
    }
    catch (error) {
        console.error("Error al obtener embarazo:", error);
        res.status(500).send("Error al obtener embarazo");
    }
}));
IncidentRouter.post("/add-pregnancy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDIncidente, PartoEna, Gestacion, NacidoVivo, AU, FUM, FPP, Sexo } = req.body;
        if (!IDIncidente ||
            !PartoEna ||
            !Gestacion ||
            !NacidoVivo ||
            !AU ||
            !FUM ||
            !FPP ||
            !Sexo) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const newPregnancy = yield database_1.Embarazo.create({
            IDIncidente,
            PartoEna,
            Gestacion,
            NacidoVivo,
            AU,
            FUM,
            FPP,
            Sexo,
        });
        return res
            .status(200)
            .json({ message: "Embarazo creado exitosamente", newPregnancy });
    }
    catch (error) {
        console.log("Error al crear embarazo:", error);
        res.status(500).send("Error al crear embarazo");
    }
}));
IncidentRouter.get("/get-incident-by-person-id/:cedula", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula } = req.params;
        if (!cedula) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const incidents = yield database_1.Incidente.findAll({
            include: [
                {
                    model: database_1.Persona,
                    required: true,
                    where: { No_Identidad: cedula },
                },
            ],
        });
        if (incidents.length === 0) {
            return res
                .status(404)
                .send("No se encontró ningún incidente para esta persona");
        }
        return res
            .status(200)
            .json({ message: "Incidentes encontrados exitosamente", incidents });
    }
    catch (error) {
        console.error("Error al obtener incidentes:", error);
        res.status(500).send("Error al obtener incidentes");
    }
}));
IncidentRouter.get("/get-incidentes-by-paramedic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        const incidents = yield database_1.Incidente.findAll({
            include: [
                {
                    model: database_1.Persona,
                    attributes: ["No_Identidad", "Nombre"],
                },
            ],
            transaction: t,
            where: { IDEmpleado: id },
        });
        if (!incidents) {
            return res
                .status(404)
                .send("No se encontró ningún incidente para este paramédico");
        }
        yield t.commit();
        return res.status(200).json(incidents);
    }
    catch (error) {
        yield t.rollback();
        console.error("Error al obtener incidentes:", error);
        res.status(500).send("Error al obtener incidentes");
    }
}));
IncidentRouter.post("/add-incident", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield database_1.sequelize.transaction();
    try {
        const { Registrar, incidente: { IDEmpleado, IDMedico, Enlace, Reporta, Fecha, Lugar, TipoIncidente, Prioridad, HistoriaAccidente, TipoTraslado, MaterialUtilizado, ProblemasMedicos, Traumas, FirmaResponsable, ubicacion, ImagenLesion }, people: { No_Identidad, Nombre, Genero, Telefono, FechaNacimiento, Ocupacion, Direccion, EstadoCivil, }, companions: { Nombre: NombreAcompanante, Parentesco, }, ambulancia: { Unidad, EnServicio }, salidaAmbulancia: { KilometrajeSalida, KilometrajeEntrada, HoraSalida, Abordaje, LLegadaHospital, HoraRegreso, }, pacienteChequeo: { ExamenFisico, Observaciones, CondicionPaciente }, hospital: { NombreHospital, Area }, medico: { nombre, PersonalSalud, Firma }, vitales: { PA, FR, FC, sp02, temp, Glucosa }, efectosPersonales: { Resguardo, Pol, Fam, Pers_Hospital, Otros, PX }, oxigeno: { Uso, OxigenoLitro, OxigenoTiempo, OxigenoCanOrofa, OxigenoCollarCerv }, glasgow: { RespuestaMotora, RespuestaVerbal, RespuestaVisual }, pupilas: { OjoDerecho, OjoIzquierdo, Normales, Reactivas }, embarazo: { PartoEnAmbulancia, Gestacion, NacidoVivo, AU, FUM, FPP, Sexo, HoraNacimiento, Via, Respuestas, STV, Parto, }, personalAmbulancia: { Motorista, Auxiliares }, // IDs del personal de la ambulancia
         } = req.body;
        console.log("Unidad:", Unidad);
        // Buscar si la persona ya existe
        let persona = yield database_1.Persona.findOne({
            where: { No_Identidad },
            transaction
        });
        // Si la persona no existe, crearla
        let IDPersona;
        if (!persona) {
            persona = yield database_1.Persona.create({
                No_Identidad,
                Nombre,
                Genero: Genero !== null && Genero !== undefined ? Genero : false,
                Telefono,
                FechaNacimiento,
                Ocupacion,
                Direccion,
                EstadoCivil,
            }, { transaction });
            IDPersona = persona.getDataValue("IDPersona");
        }
        else {
            IDPersona = persona.getDataValue("IDPersona");
        }
        // Crear acompañante si aplica
        let IDAcompanante = null;
        if (NombreAcompanante || Parentesco) {
            const acompanante = yield database_1.Acompanante.create({ Nombre: NombreAcompanante, Parentesco }, { transaction });
            IDAcompanante = acompanante.getDataValue("IDAcompanante");
        }
        // Verificar si existe una ambulancia con la unidad enviada
        let IDAmbulancia = null;
        if (Unidad) {
            const existingAmbulance = yield database_1.Ambulancia.findOne({
                where: { Unidad },
                transaction, // Usa la misma transacción
            });
            if (!existingAmbulance) {
                // Si la ambulancia no existe, aborta el proceso
                yield transaction.rollback();
                return res.status(400).json({
                    message: `Error: No existe una ambulancia con la unidad '${Unidad}'.`,
                });
            }
            // Si la ambulancia existe, asigna su ID
            IDAmbulancia = existingAmbulance.getDataValue("IDAmbulancia");
        }
        // Asociar personal a la ambulancia existente
        if (IDAmbulancia) {
            // Registrar Motorista
            if (Motorista) {
                yield database_1.PersonalAmbulancia.create({
                    IDAmbulancia,
                    IDEmpleado: Motorista,
                }, { transaction });
            }
            // Registrar Auxiliares
            if (Auxiliares && Auxiliares.length > 0) {
                for (const auxiliar of Auxiliares) {
                    yield database_1.PersonalAmbulancia.create({
                        IDAmbulancia,
                        IDEmpleado: auxiliar,
                    }, { transaction });
                }
            }
        }
        // Crear hospital si aplica
        let hospitalData = null;
        if (NombreHospital || Area) {
            hospitalData = yield database_1.Hospital.create({ NombreHospital, Area }, { transaction });
        }
        // Crear médico si aplica
        let medicoData = null;
        if (nombre || PersonalSalud || Firma) {
            medicoData = yield database_1.Medico.create({ nombre: nombre, PersonalSalud, Firma }, { transaction });
        }
        // Crear incidente
        const newIncident = yield database_1.Incidente.create({
            IDPersona,
            IDAcompanante,
            IDEmpleado,
            Enlace,
            Reporta,
            Fecha,
            Lugar,
            TipoIncidente,
            Prioridad,
            HistoriaAccidente,
            TipoTraslado,
            MaterialUtilizado,
            ProblemasMedicos,
            Traumas,
            FirmaResponsable,
            IDMedico: medicoData ? medicoData.getDataValue("IDMedico") : null,
            ubicacion,
            ImagenLesion,
        }, { transaction });
        const IDIncidente = newIncident.getDataValue("IDIncidente");
        // Crear signos vitales si aplica
        if (Registrar[0]) {
            yield database_1.SignosVitales.create({ IDIncidente, PA, FR, FC, sp02, temp, Glucosa, ubicacion, ImagenLesion }, { transaction });
        }
        // Crear salida ambulancia si aplica
        if (KilometrajeSalida ||
            KilometrajeEntrada ||
            HoraSalida ||
            Abordaje ||
            LLegadaHospital ||
            HoraRegreso) {
            yield database_1.Salida_Ambulancia.create({
                IDAmbulancia,
                IDIncidente,
                KilometrajeSalida,
                KilometrajeEntrada,
                HoraSalida,
                Abordaje,
                LLegadaHospital,
                HoraRegreso,
            }, { transaction });
        }
        // Crear efectos personales si aplica
        if (Registrar[1]) {
            yield database_1.PacienteEfectosPersonales.create({ IDIncidente, Resguardo, Pol, Fam, Pers_Hospital, Otros, PX }, { transaction });
        }
        // Crear oxígeno si aplica
        if (Registrar[2]) {
            yield database_1.Oxigeno.create({ IDIncidente, Uso, OxigenoLitro, OxigenoTiempo, OxigenoCanOrofa, OxigenoCollarCerv }, { transaction });
        }
        // Crear Glasgow si aplica
        if (Registrar[3]) {
            yield database_1.Glascow.create({ IDIncidente, RespuestaMotora, RespuestaVerbal, RespuestaVisual }, { transaction });
        }
        // Crear pupilas si aplica
        if (Registrar[4]) {
            yield database_1.Pupilas.create({ IDIncidente, OjoDerecho, OjoIzquierdo, Normales, Reactivas }, { transaction });
        }
        // Crear embarazo si aplica
        if (Registrar[5]) {
            yield database_1.Embarazo.create({
                IDIncidente,
                PartoEnAmbulancia,
                Gestacion,
                NacidoVivo,
                AU,
                FUM,
                FPP,
                Sexo,
                HoraNacimiento,
                Via,
                Respuestas,
                STV,
                Parto,
            }, { transaction });
        }
        if (ExamenFisico || Observaciones || CondicionPaciente) {
            const examenFisicoData = Array.isArray(ExamenFisico) ? ExamenFisico : [];
            const observacionesData = Observaciones || null;
            const condicionPacienteData = CondicionPaciente || null;
            if (!IDIncidente) {
                throw new Error("IDIncidente es requerido para registrar PacienteChequeo.");
            }
            yield database_1.PacienteChequeo.create({
                IDIncidente, // Asegúrate de que este valor no sea null ni una cadena vacía
                ExamenFisico: examenFisicoData,
                Observaciones: observacionesData,
                CondicionPaciente: condicionPacienteData,
            }, { transaction });
        }
        yield transaction.commit();
        return res.status(200).json({ message: "Incidente creado exitosamente", newIncident });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Transacción fallida:", error);
        return res.status(500).json({ message: "Error al crear el incidente:", error });
    }
}));
IncidentRouter.get('/get-patient-check-by-incident-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const patientCheck = yield database_1.PacienteChequeo.findOne({ where: { IDIncidente: id } });
        if (patientCheck == null) {
            return res.status(404).send('No se encontro el chequeo del paciente');
        }
        return res.status(200).json(patientCheck);
    }
    catch (error) {
        console.error('Error al obtener chequeo del paciente:', error);
        res.status(500).send('Error al obtener chequeo del paciente');
    }
}));
exports.default = IncidentRouter;
