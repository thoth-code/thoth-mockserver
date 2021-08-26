import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

/**
 * 
 * CONSTANTS
 * 
 */
const app = express();
const port = 5000;
const ACCESS_TOKEN_EXP = 60000*5;
// const REFRESH_TOKEN_EXP = 60000*5;
const options = {
    origin: 'http://saltwalks.ddns.net:8080', // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200 // 응답 상태 200으로 설정 
};
// TEST AES256 SECRKEY
const SECRKEY = 'JEfWefI0E1qlnIz06qmob7cZp5IzH/i7KwOI2xqWfhE=';

/**
 * 
 * MIDDLEWARES
 * 
 */
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));
app.use(cookieParser())

/**
 * 
 * LOCAL FUNCTIONS
 * 
 */
const read = (name: string) => (fs.readFileSync(__dirname + '/json/' + name + '.json').toString());

/**
 * 
 * ROUTERS
 * 
 */
app.get('/', (req, res) => {
    res.send('THOTH API TEST SERVER');
});

app.get(/\/api\/notes.*/, (req, res) => {
    console.log("Search Note Requested: " + req.url);
    res.send(read('postit'));
});

app.post('/api/note', (req, res) => {
    console.log("New Note Post Requested : " + req.body);
    res.send(JSON.stringify({error: null}));
});

app.post('/api/signin', (req, res) => {
    console.log("Sign in requested : " + req.body);
    jwt.sign({
        uid: 'test-uid-200',
    }, SECRKEY, {
        expiresIn: ACCESS_TOKEN_EXP,
    }, (err, token) => {
        if(err !== null) {
            console.error(err);
        } else {
            res.cookie('accessToken', token, {
                maxAge: ACCESS_TOKEN_EXP,
                path: '/',
            });
            res.status(200).json({
                    error: null,
                    token,
                }
            );
        }
    });
});

app.post('/api/signup', (req, res) => {
    console.log("Sign Up Requested : " + req.body);
    res.send(JSON.stringify({ error: null }));
});

app.delete(/\/api\/note\/.*/, (req, res) => {
    console.log("Delete note requested:", req.url);
    res.send(JSON.stringify({ error: null }));
});

app.put('/api/note', (req, res) => {
    console.log("Edit note requested : " + req.body);
    res.send(JSON.stringify({ error: null }));
});

app.put('/api/myboard', (req, res) => {
    console.log("Edit my board requested : " + req.body);
    res.send(JSON.stringify({ error: null }));
});

app.post('/api/myboard', (req, res) => {
    console.log("Attach note requested : " + req.body);
    res.send(JSON.stringify({ error: null }));
});

app.get('/api/myboard', (req, res) => {
    console.log("MyBoard requested : " + JSON.stringify(req.cookies));
    res.send(read('postit'));
});

app.delete(/\/api\/myboard\/.*/, (req, res) => {
    console.log("Delete note requested:", req.url);
    res.send(JSON.stringify({ error: null }));
});

/**
 * 
 * SERVER START
 * 
 */
app.listen(port, () => {
    console.log(`[${new Date()}] Thoth API Test Server Started`);
});