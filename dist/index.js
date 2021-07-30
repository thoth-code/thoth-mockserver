"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var jwt = __importStar(require("jsonwebtoken"));
var fs = __importStar(require("fs"));
/**
 *
 * CONSTANTS
 *
 */
var app = express_1.default();
var port = 3000;
var ACCESS_TOKEN_EXP = 60000 * 2;
var REFRESH_TOKEN_EXP = 60000 * 5;
var options = {
    origin: 'http://localhost:8080',
    credentials: true,
    optionsSuccessStatus: 200 // 응답 상태 200으로 설정 
};
// TEST AES256 SECRKEY
var SECRKEY = 'JEfWefI0E1qlnIz06qmob7cZp5IzH/i7KwOI2xqWfhE=';
/**
 *
 * MIDDLEWARES
 *
 */
app.use(cors_1.default(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(morgan_1.default('dev'));
app.use(cookie_parser_1.default());
/**
 *
 * LOCAL FUNCTIONS
 *
 */
var read = function (name) { return (fs.readFileSync(__dirname + '/json/' + name + '.json').toString()); };
var write = function (name, data) { return (fs.writeFileSync(__dirname + '/json/' + name + '.json', data)); };
/**
 *
 * ROUTERS
 *
 */
app.get('/', function (req, res) {
    res.send('THOTH API TEST SERVER');
});
// app.get('/note', (req, res) => {
//     res.send(read('postit'));
// });
app.get(/\/note.*/, function (req, res) {
    res.send(read('postit'));
});
app.post('/note', function (req, res) {
    req.on("data", function (data) {
        console.log("New Note Post Requested : " + data);
        var oldJson = JSON.parse(read('postit'));
        var toPush = JSON.parse("" + data);
        oldJson.push(toPush);
        var newJson = JSON.stringify(oldJson);
        write('postit', newJson);
        res.send(JSON.stringify({ error: null }));
    });
});
app.post('/signin', function (req, res) {
    req.on("data", function (data) {
        console.log("Sign In Requested : " + data);
        jwt.sign({
            test: 'test',
        }, SECRKEY, {
            expiresIn: '1h',
        }, function (err, token) {
            if (err !== null) {
                console.error(err);
            }
            else {
                res.cookie('accessToken', token, {
                    maxAge: ACCESS_TOKEN_EXP,
                    path: '/',
                });
                res.status(200).json({
                    error: null,
                    token: token,
                });
            }
        });
    });
});
app.post('/signup', function (req, res) {
    req.on("data", function (data) {
        console.log("Sign Up Requested : " + data);
        res.send(JSON.stringify({ error: null }));
    });
});
/**
 *
 * SERVER START
 *
 */
app.listen(port, function () {
    console.log("[" + new Date() + "] Thoth API Test Server Started");
});
