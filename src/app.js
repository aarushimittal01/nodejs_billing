const express = require('express');
const app = express();
const bodyParser = require('body-parser');

import { createBill } from "./controller"

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>A JavaScript project</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>A JavaScript project</h1>
</body>
</html>`;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(html);
});

app.post("/api/create_bill", createBill)

module.exports = app;