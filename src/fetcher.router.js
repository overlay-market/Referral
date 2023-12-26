const { Router } = require("express");
const fetcherRouter = Router();
const {
  updateBuildTransactions,
  updateUnwindTransactions
} = require("./fetcher.controller");

fetcherRouter.get("/update-build-transactions", updateBuildTransactions);
fetcherRouter.get("/update-unwind-transactions", updateUnwindTransactions);

module.exports = fetcherRouter;
