const mongoose = require("mongoose");
require("dotenv").config();

const mongo_url = process.env.MONGO_DB_URL;

mongoose.connection.once("open", () => {
  console.log("mongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(mongo_url);
}

async function mongoDisconnect() {
  console.log("mongoDB done");
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
