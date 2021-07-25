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
const port = 3000;
const ACCESS_TOKEN_EXP = 60000*2;
const REFRESH_TOKEN_EXP = 60000*5;
const options = {
    origin: 'http://localhost:8080', // 접근 권한을 부여하는 도메인
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
const write = (name: string, data: string) => (fs.writeFileSync(__dirname + '/json/' + name + '.json', data));

/**
 * 
 * ROUTERS
 * 
 */
app.get('/', (req, res) => {
    res.send('THOTH API TEST SERVER');
});

// app.get('/note', (req, res) => {
//     res.send(read('postit'));
// });

app.get(/\/note.*/, (req, res) => {
    res.send(read('postit'));
})

app.post('/note', (req, res) => {
    req.on("data", data => {
        console.log("New Note Post Requested : " + data);
        let oldJson = JSON.parse(read('postit')) as object[];
        let toPush = JSON.parse("" + data);
        oldJson.push(toPush);
        let newJson = JSON.stringify(oldJson);
        write('postit', newJson);
        res.send(JSON.stringify({error: null}));
    })
});

app.post('/signin', (req, res) => {
    req.on("data", data => {
        console.log("Sign In Requested : " + data);
        jwt.sign({
            test: 'test',
        }, SECRKEY, {
            expiresIn: '1h',
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
    })
});

app.post('/signup', (req, res) => {
    req.on("data", data => {
        console.log("Sign Up Requested : " + data);
        res.send(JSON.stringify({ error: null }));
    })
});

/**
 * 
 * SERVER START
 * 
 */
app.listen(port, () => {
    console.log(`[${new Date()}] Thoth API Test Server Started`);
});