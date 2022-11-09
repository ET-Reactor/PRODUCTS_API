require('dotenv').config();
const express = require("express")
const router = require('./routes.js')
const path = require("path");
const app = express();

app.use(express.json());

app.use('/api', router)
app.get('/loaderio-8b0e638a0ddbf6f2967d9d36b7374ab3/', (req, res) => {
  res.send('loaderio-8b0e638a0ddbf6f2967d9d36b7374ab3');
})

const PORT = 3000;

app.listen(PORT);
console.log(`server listening at PORT: ${PORT}`)

