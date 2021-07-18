import express from 'express';
import * as fs from 'fs';

const app = express();
const port = 3000;
const testClient = 'http://localhost:8080'

const read = (name: string) => (fs.readFileSync(__dirname + '/json/' + name + '.json').toString());
const write = (name: string, data: string) => (fs.writeFileSync(__dirname + '/json/' + name + '.json', data));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send('aloha');
});

//THOTH test cases
app.get('/all', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send(read('postit'));
});

app.post('/new', (req, res) => {
    req.on("data", data => {
        console.log(""+data);
        let oldJson = JSON.parse(read('postit')) as object[];
        let toPush = JSON.parse("" + data);
        oldJson.push(toPush);
        let newJson = JSON.stringify(oldJson);
        write('postit', newJson);
        res.setHeader('Access-Control-Allow-Origin', testClient);
        res.send("hoi");
    })
});
//END THOTH test cases

app.get('/get-test', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', testClient);
    res.send(read('test'));
});

app.post('/post-test', (req, res) => {
    req.on("data", data => {
        console.log(""+data);
        res.setHeader('Access-Control-Allow-Origin', testClient);
        res.send("hoi");
    })
});

app.listen(port, () => {
    console.log(`[${new Date()}] Thoth API Test Server Started`);
});