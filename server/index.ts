import express from 'express';
import bodyParser from 'body-parser';

const port = 5071;

const app = express();
const rawBodyParser = bodyParser.raw();
const jsonBodyParser = bodyParser.json();

app.get('/', (req, res) => res.send('Backend for MySwarm App. Not of much use publicly :)'));

app.post('/ipfs/add', rawBodyParser, (req, res) => {
  res.send('add');
});

app.post('/ipfs/cat', jsonBodyParser, (req, res) => {
  res.send('cat');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
