const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})