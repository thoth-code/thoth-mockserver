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
var fs = __importStar(require("fs"));
var app = express_1.default();
var port = 3000;
var testClient = 'http://localhost:8080';
var read = function (name) { return (fs.readFileSync(__dirname + '/json/' + name + '.json').toString()); };
var write = function (name, data) { return (fs.writeFileSync(__dirname + '/json/' + name + '.json', data)); };
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send('aloha');
});
//THOTH test cases
app.get('/all', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send(read('postit'));
});
app.post('/new', function (req, res) {
    req.on("data", function (data) {
        console.log("" + data);
        var oldJson = JSON.parse(read('postit'));
        var toPush = JSON.parse("" + data);
        oldJson.push(toPush);
        var newJson = JSON.stringify(oldJson);
        write('postit', newJson);
        res.setHeader('Access-Control-Allow-Origin', testClient);
        res.send("hoi");
    });
});
//END THOTH test cases
app.get('/get-test', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send(read('test'));
});
app.post('/post-test', function (req, res) {
    req.on("data", function (data) {
        console.log("" + data);
        res.setHeader('Access-Control-Allow-Origin', testClient);
        res.send("hoi");
    });
});
app.listen(port, function () {
    console.log("[" + new Date() + "] Thoth API Test Server Started");
});
