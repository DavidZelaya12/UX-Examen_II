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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const poblarDb_1 = require("./poblarDb");
const UserRoutes_1 = __importDefault(require("./Routers/UserRoutes"));
const MainRoutes_1 = __importDefault(require("./Routers/MainRoutes"));
const IncidentRoutes_1 = __importDefault(require("./Routers/IncidentRoutes"));
const CompanionRoutes_1 = __importDefault(require("./Routers/CompanionRoutes"));
const AmbulanceRoutes_1 = require("./Routers/AmbulanceRoutes");
const StatsRoutes_1 = require("./Routers/StatsRoutes");
const app = (0, express_1.default)();
require('dotenv').config();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/main', MainRoutes_1.default);
app.use('/user', UserRoutes_1.default);
app.use('/incident', IncidentRoutes_1.default);
app.use('/companion', CompanionRoutes_1.default);
app.use('/ambulance', AmbulanceRoutes_1.AmbulanceRouter);
app.use('/stats', StatsRoutes_1.StatsRouter);
// Sincronizar las tablas y levantar el servidor
database_1.sequelize.sync({ force: true })
    .then(() => {
    console.log('Tablas sincronizadas con éxito.');
    app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`El servidor está corriendo en el puerto ${port}`);
        yield (0, poblarDb_1.poblarBaseDeDatos)();
    }));
})
    .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
});
