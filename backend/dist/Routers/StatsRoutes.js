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
exports.StatsRouter = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const sequelize_1 = require("sequelize");
const StatsRouter = (0, express_1.Router)();
exports.StatsRouter = StatsRouter;
StatsRouter.get('/incident-by-gender/:genero', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genero } = req.params;
        const incident = yield database_1.Incidente.findAll({
            include: [{
                    model: database_1.Persona,
                    where: { Genero: genero }
                }]
        });
        return res.status(200).json(incident);
    }
    catch (error) {
        console.error('Error al obtener incidente por género:', error);
        res.status(500).send('Error al obtener incidente por género');
    }
}));
StatsRouter.get('/incident-by-age/:edad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { edad } = req.params;
        const incident = yield database_1.Incidente.findAll({ where: { edad } });
        return res.status(200).json(incident);
    }
    catch (error) {
        console.error('Error al obtener incidente por edad:', error);
        res.status(500).send('Error al obtener incidente por edad');
    }
}));
StatsRouter.get('/get-age-by-months/:year/:monthbegin/:monthend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        const monthbegin = parseInt(req.params.monthbegin, 10);
        const monthend = parseInt(req.params.monthend, 10);
        if (!year || !monthbegin || !monthend) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const query = `
            SELECT
                CASE
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 0 AND 10 THEN '0 a 10'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 11 AND 20 THEN '11 a 20'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 21 AND 30 THEN '21 a 30'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 31 AND 40 THEN '31 a 40'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 41 AND 50 THEN '41 a 50'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 51 AND 60 THEN '51 a 60'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 61 AND 70 THEN '61 a 70'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 71 AND 80 THEN '71 a 80'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 81 AND 90 THEN '81 a 90'
                    WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, p."FechaNacimiento")) BETWEEN 91 AND 100 THEN '91 a 100'
                    ELSE 'SD'
                END as rango_edad,
                EXTRACT(MONTH FROM i."Fecha") as mes,
                COUNT(*)::integer as cantidad
            FROM "Incidente" i
            INNER JOIN "Persona" p ON i."IDPersona" = p."IDPersona"
            WHERE EXTRACT(YEAR FROM i."Fecha") = :year
            AND EXTRACT(MONTH FROM i."Fecha") BETWEEN :monthbegin AND :monthend
            GROUP BY rango_edad, mes
            ORDER BY mes, rango_edad;
        `;
        const result = yield database_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { year, monthbegin, monthend },
        });
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const ageRanges = [
            '0 a 10', '11 a 20', '21 a 30', '31 a 40', '41 a 50',
            '51 a 60', '61 a 70', '71 a 80', '81 a 90', '91 a 100', 'SD'
        ];
        const organizedData = months.slice(monthbegin - 1, monthend).map((month) => ({
            mes: month,
            total: 0,
            edades: ageRanges.reduce((acc, range) => {
                acc[range] = 0;
                return acc;
            }, {})
        }));
        result.forEach((row) => {
            const monthIndex = row.mes - monthbegin;
            if (organizedData[monthIndex]) {
                organizedData[monthIndex].edades[row.rango_edad] = row.cantidad;
                organizedData[monthIndex].total += row.cantidad;
            }
        });
        res.status(200).json(organizedData);
    }
    catch (error) {
        console.error('Error al obtener edades por mes:', error);
        res.status(500).send('Error al obtener edades por mes');
    }
}));
StatsRouter.get('/get-gender-by-month/:year/:monthbegin/:monthend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        const monthbegin = parseInt(req.params.monthbegin, 10);
        const monthend = parseInt(req.params.monthend, 10);
        if (!year || !monthbegin || !monthend) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const query = `
            SELECT
                CASE
                    WHEN p."Genero" = true THEN 'Masculino'
                    WHEN p."Genero" = false THEN 'Femenino'
                    ELSE 'SD'
                END as genero,
                EXTRACT(MONTH FROM i."Fecha") as mes,
                COUNT(*)::integer as cantidad
            FROM "Incidente" i
            INNER JOIN "Persona" p ON i."IDPersona" = p."IDPersona"
            WHERE EXTRACT(YEAR FROM i."Fecha") = :year
            AND EXTRACT(MONTH FROM i."Fecha") BETWEEN :monthbegin AND :monthend
            GROUP BY genero, mes
            ORDER BY mes, genero;
        `;
        const result = yield database_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { year, monthbegin, monthend },
        });
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const genders = ['Femenino', 'Masculino', 'SD'];
        const organizedData = months.slice(monthbegin - 1, monthend).map((month) => ({
            mes: month,
            total: 0,
            generos: genders.reduce((acc, gender) => {
                acc[gender] = 0;
                return acc;
            }, {})
        }));
        result.forEach((row) => {
            const monthIndex = row.mes - monthbegin;
            if (organizedData[monthIndex]) {
                organizedData[monthIndex].generos[row.genero] = row.cantidad;
                organizedData[monthIndex].total += row.cantidad;
            }
        });
        res.status(200).json(organizedData);
    }
    catch (error) {
        console.error('Error al obtener datos por género y mes:', error);
        res.status(500).send('Error al obtener datos por género y mes');
    }
}));
StatsRouter.get('/genero-por-mes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield database_1.Incidente.findAll({
            attributes: [
                [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)('MONTH FROM "Fecha"')), 'mes'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)(`CASE WHEN "Persona"."Genero" = true THEN 1 ELSE 0 END`)), 'masculino'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)(`CASE WHEN "Persona"."Genero" = false THEN 1 ELSE 0 END`)), 'femenino']
            ],
            include: [
                {
                    model: database_1.Persona,
                    attributes: [],
                },
            ],
            where: {
                Fecha: {
                    [sequelize_1.Op.gte]: (0, sequelize_1.literal)(`CURRENT_DATE - INTERVAL '12 months'`)
                }
            },
            group: [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)('MONTH FROM "Fecha"'))],
            order: [[(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)('MONTH FROM "Fecha"')), 'ASC']]
        });
        if (!results.length) {
            return res.send('No se encontraron datos de genero por mes');
        }
        res.json(results);
    }
    catch (error) {
        console.error('Error al obtener datos de genero por mes:', error);
        res.send('Error al obtener datos de genero por mes');
    }
}));
StatsRouter.get('/get-diagnosis-by-month/:year/:monthbegin/:monthend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        const monthbegin = parseInt(req.params.monthbegin, 10);
        const monthend = parseInt(req.params.monthend, 10);
        if (!year || !monthbegin || !monthend) {
            return res.status(400).send('Faltan campos obligatorios');
        }
        const query = `
            SELECT
                i."TipoIncidente" as diagnostico,
                EXTRACT(MONTH FROM i."Fecha") as mes,
                COUNT(*)::integer as cantidad
            FROM "Incidente" i
            WHERE EXTRACT(YEAR FROM i."Fecha") = :year
            AND EXTRACT(MONTH FROM i."Fecha") BETWEEN :monthbegin AND :monthend
            GROUP BY diagnostico, mes
            ORDER BY mes, diagnostico;
        `;
        const result = yield database_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { year, monthbegin, monthend },
        });
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const diagnosisTypes = [
            'Fallecido', 'Enfermedad Comun', 'Enfermedad Cronica', 'Embarazo',
            'Parto Extrahospitalario', 'Accidente Vial', 'Herida por Arma de Fuego',
            'Trauma', 'Intoxicacion', 'Cancelado', 'Fractura'
        ];
        const organizedData = months.slice(monthbegin - 1, monthend).map((month) => ({
            mes: month,
            total: 0,
            diagnosticos: diagnosisTypes.reduce((acc, diagnosis) => {
                acc[diagnosis] = 0;
                return acc;
            }, {})
        }));
        result.forEach((row) => {
            const monthIndex = row.mes - monthbegin;
            if (organizedData[monthIndex]) {
                organizedData[monthIndex].diagnosticos[row.diagnostico] = row.cantidad;
                organizedData[monthIndex].total += row.cantidad;
            }
        });
        res.status(200).json({ organizedData });
    }
    catch (error) {
        console.error('Error al obtener datos por diagnóstico y mes:', error);
        res.status(500).send('Error al obtener datos por diagnóstico y mes');
    }
}));
StatsRouter.get('/total-incidents-from-last-semester', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incidents = yield database_1.Incidente.count({
            where: {
                Fecha: {
                    [sequelize_1.Op.gte]: (0, sequelize_1.literal)(`CURRENT_DATE - INTERVAL '6 months'`)
                }
            }
        });
        res.json({ incidents });
    }
    catch (error) {
        console.error('Error al obtener total de incidentes del último semestre:', error);
        res.send('Error al obtener total de incidentes del último semestre');
    }
}));
StatsRouter.get('/age-stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield database_1.sequelize.query(`
            WITH ultimos_meses AS (
                SELECT 
                    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' * s.a AS mes
                FROM generate_series(0, 11) AS s(a)
            ),
            rangos_edad AS (
                SELECT unnest(ARRAY[
                    '1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '100+'
                ]) AS rango,
                generate_series(1, 11) AS orden_rango -- Asignar un orden numérico a cada rango
            ),
            datos AS (
                SELECT 
                    um.mes,
                    r.rango,
                    r.orden_rango,
                    COALESCE(COUNT(p."IDPersona"), 0)::INTEGER AS cantidad
                FROM ultimos_meses um
                CROSS JOIN rangos_edad r
                LEFT JOIN "Incidente" i 
                    ON date_trunc('month', i."Fecha") = um.mes
                LEFT JOIN "Persona" p 
                    ON i."IDPersona" = p."IDPersona"
                    AND p."FechaNacimiento" IS NOT NULL
                    AND CASE 
                        WHEN r.rango = '1-10' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 1 AND 10
                        WHEN r.rango = '11-20' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 11 AND 20
                        WHEN r.rango = '21-30' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 21 AND 30
                        WHEN r.rango = '31-40' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 31 AND 40
                        WHEN r.rango = '41-50' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 41 AND 50
                        WHEN r.rango = '51-60' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 51 AND 60
                        WHEN r.rango = '61-70' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 61 AND 70
                        WHEN r.rango = '71-80' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 71 AND 80
                        WHEN r.rango = '81-90' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 81 AND 90
                        WHEN r.rango = '91-100' THEN EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) BETWEEN 91 AND 100
                        ELSE EXTRACT(YEAR FROM AGE(p."FechaNacimiento")) > 100
                    END
                GROUP BY um.mes, r.rango, r.orden_rango
            )
            SELECT 
                EXTRACT(YEAR FROM mes) AS anio,
                EXTRACT(MONTH FROM mes)::INTEGER AS numero_mes,
                r.rango, 
                cantidad, 
                mes AS fecha_original,
                orden_rango
            FROM datos r
            UNION ALL
            SELECT 
                EXTRACT(YEAR FROM mes) AS anio,
                EXTRACT(MONTH FROM mes)::INTEGER AS numero_mes,
                'Total' AS rango, 
                SUM(cantidad),
                mes AS fecha_original,
                NULL AS orden_rango
            FROM datos 
            GROUP BY mes
            ORDER BY fecha_original, 
                     orden_rango NULLS LAST; 
            `, { type: sequelize_1.QueryTypes.SELECT });
        const mesesEnEspañol = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const statsEnEspañol = stats.map((item) => ({
            mes: `${mesesEnEspañol[item.numero_mes - 1]} ${item.anio}`,
            rango: item.rango,
            cantidad: item.cantidad,
        }));
        res.status(200).json(statsEnEspañol);
    }
    catch (error) {
        console.error('Error al obtener estadísticas de edad:', error);
        res.status(500).send('Error al obtener estadísticas de edad');
    }
}));
StatsRouter.get('/gender-stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield database_1.sequelize.query(`
            WITH ultimos_meses AS (
                SELECT 
                    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' * s.a AS mes
                FROM generate_series(0, 11) AS s(a)
            ),
            datos AS (
                SELECT 
                    um.mes,
                    EXTRACT(YEAR FROM um.mes) AS anio,
                    EXTRACT(MONTH FROM um.mes)::INTEGER AS numero_mes,
                    COALESCE(SUM(CASE WHEN p."Genero" = TRUE THEN 1 ELSE 0 END), 0)::INTEGER AS masculino,
                    COALESCE(SUM(CASE WHEN p."Genero" = FALSE THEN 1 ELSE 0 END), 0)::INTEGER AS femenino
                FROM ultimos_meses um
                LEFT JOIN "Incidente" i 
                    ON date_trunc('month', i."Fecha") = um.mes
                LEFT JOIN "Persona" p 
                    ON i."IDPersona" = p."IDPersona"
                GROUP BY um.mes
            ),
            resultados AS (
                SELECT 
                    um.mes,
                    um.anio,
                    um.numero_mes,
                    masculino,
                    femenino,
                    (masculino + femenino) AS total,
                    um.mes AS fecha_original
                FROM datos um
            )
            SELECT 
                numero_mes, 
                anio, 
                masculino, 
                femenino, 
                total, 
                fecha_original
            FROM resultados
            ORDER BY fecha_original;
            `, { type: sequelize_1.QueryTypes.SELECT });
        const mesesEnEspañol = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const statsEnEspañol = stats.map((item) => ({
            mes: `${mesesEnEspañol[item.numero_mes - 1]} ${item.anio}`,
            masculino: item.masculino,
            femenino: item.femenino,
            total: item.total,
        }));
        res.status(200).json(statsEnEspañol);
    }
    catch (error) {
        console.error('Error al obtener estadísticas de género:', error);
        res.status(500).send('Error al obtener estadísticas de género');
    }
}));
