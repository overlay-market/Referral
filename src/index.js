require("dotenv").config();

const { createServer } = require("http");
const { mongoConnect } = require("./services/mongo");

const app = require("./app");
const server = createServer(app);

server.listen(8080, async function () {
  await mongoConnect();
  console.log("Listening on http://0.0.0.0:8080");
});
