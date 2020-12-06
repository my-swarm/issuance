import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { KyaStorage, Kya } from './lib';
import { ipfsConfig } from './config';

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(
  bodyParser.json({
    limit: '100mb',
  }),
);

const storage = new KyaStorage(ipfsConfig);

app.get('/', (req, res) => res.send('Backend for MySwarm App. Not of much use publicly :)'));

app.post('/api/kya/put', (req, res) => {
  console.log('put');
  storage.put(req.body).then(({ cid, hash }) => res.send({ cid, hash }));
});

app.post('/api/kya/get', (req, res) => {
  console.log('get', req.body.cid);
  storage.get(req.body.cid).then((kya: Kya) => res.send(kya));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
