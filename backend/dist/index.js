"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const posts_routes_1 = __importDefault(require("@routes/posts/posts-routes"));
const admin_routes_1 = __importDefault(require("@routes/admin/admin-routes"));
const other_routes_1 = __importDefault(require("@routes/other/other-routes"));
const user_routes_1 = __importDefault(require("@routes/users/user-routes"));
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const user_cleanup_task_1 = __importDefault(require("@middleware/cronJobs/user-cleanup-task"));
const check_auth_1 = __importDefault(require("@middleware/check-auth"));
const check_account_status_1 = __importDefault(require("@middleware/check-account-status"));
const activate_account_1 = __importDefault(require("@middleware/activate-account"));
const publisher_controllers_1 = require("@controllers/admin/publisher/publisher-controllers");
const publisher_routes_1 = __importDefault(require("@routes/admin/publisher/publisher-routes"));
const MONGO_URL = process.env.MONGO_URL || "";
const LOCAL_HOST = process.env.LOCAL_HOST || 5050;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins, similar to the res.setHeader('Access-Control-Allow-Origin', '*')
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Allow specific methods
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Allow specific headers
    preflightContinue: false, // Preflight requests (OPTIONS) will respond with 200 automatically
    optionsSuccessStatus: 200, // For legacy browsers that might have issues with 204 response
}));
app.delete("/api/deletePost", publisher_controllers_1.deletePost);
app.use(check_auth_1.default);
app.post("/api/user/account/activate-account", activate_account_1.default);
app.use(check_account_status_1.default);
app.use("/api/public", posts_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/publisher", publisher_routes_1.default);
app.use("/api/other", other_routes_1.default);
//Error showing if none of the routes found!
app.use((req, res, next) => {
    next(new http_errors_1.default("Could not find this route.", 404));
});
//httperror middleware use here to return a valid json error instead any html error page
app.use((error, req, res, next) => {
    const statusCode = error.code || 500;
    const errorMessage = error.message || "An unknown error occurred!";
    const response = Object.assign({ message: errorMessage }, (error.extraData && { extraData: error.extraData }));
    res.status(statusCode).json(response);
});
//todo
(0, user_cleanup_task_1.default)();
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => {
    app.listen(Number(LOCAL_HOST), () => {
        console.log(`Server is running on port ${LOCAL_HOST}`);
    });
})
    .catch((err) => console.log(err));
