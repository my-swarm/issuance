import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { KyaStorage, Kya } from './lib';
import { ipfsConfig } from './config';

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

const storage = new KyaStorage(ipfsConfig);

app.get('/', (req, res) => res.send('Backend for MySwarm App. Not of much use publicly :)'));

app.post('/api/kya/put', (req, res) => {
  storage.put(req.body).then((cid: string) => res.send({ cid }));
});

app.post('/api/kya/get', (req, res) => {
  storage.get(req.body.cid).then((kya: Kya) => res.send(kya));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
