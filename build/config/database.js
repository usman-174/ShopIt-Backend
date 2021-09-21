"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = () => {
    mongoose_1.default.connect(String(process.env.CONNECTION_STRING), { useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true
    }).then(con => {
        console.log('DATABASE CONNECTED WITH HOST ' + con.connection.host);
        console.log('-----------------------------------------');
    }).catch(err => {
        console.log('Failed to connect to database ' + err.message);
        console.log('-----------------------------------------');
    });
};
//# sourceMappingURL=database.js.map