const express = require('express');
const app = express();
const PORT = 4000;

app.use("cors")

app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Node.js!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
