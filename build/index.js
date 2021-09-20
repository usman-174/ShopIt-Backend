"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const users_1 = __importDefault(require("./routes/users"));
const errors_1 = __importDefault(require("./middlewares/errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Cloudinary_1 = __importDefault(require("./utils/Cloudinary"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const payment_1 = __importDefault(require("./routes/payment"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const PORT = process.env.PORT || 4000;
const app = express_1.default();
Cloudinary_1.default();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookie_parser_1.default());
app.use(express_fileupload_1.default());
app.use(cors_1.default({
    credentials: true,
    origin: process.env.NODE_ENV === "production"
        ? process.env.ORIGIN
        : 'http://localhost:3000',
    optionsSuccessStatus: 200,
}));
process.on('uncaughtException', (err) => {
    console.log(`Error = ${err.message}`);
    console.log('Shutting down server due to uncaughtException Error');
    process.exit(1);
});
app.use('/api/products', products_1.default);
app.use('/api/users', users_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/payment', payment_1.default);
app.use(errors_1.default);
const server = app.listen(PORT, async () => {
    database_1.default();
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
process.on('unhandledRejection', (err) => {
    console.error("Error Message = " + err.message);
    console.error("Error Stack = " + err.stack);
    server.close(() => {
        console.log('Shutting down server due to unhandledRejection Error');
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map