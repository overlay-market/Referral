const fetcher = require('./fetcher')

let isUpdateBuildTransactionsRunning = false
async function updateBuildTransactions(req, res) {
  // Check if the function is already running
  if (isUpdateBuildTransactionsRunning) {
    return res.status(400).json({
      error: "Update in progress. Please try again later.",
    });
  }
  // Set the lock variable to true
  isUpdateBuildTransactionsRunning = true;

  try {
    const result = await fetcher.updateBuildTransactions();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  } finally {
    // Reset the lock variable to false to allow subsequent requests
    isUpdateBuildTransactionsRunning = false;
  }
}

let isUpdateUnwindTransactionsRunning = false
async function updateUnwindTransactions(req, res) {
  // Check if the function is already running
  if (isUpdateUnwindTransactionsRunning) {
    return res.status(400).json({
      error: "Update in progress. Please try again later.",
    });
  }
  // Set the lock variable to true
  isUpdateUnwindTransactionsRunning = true;

  try {
    const result = await fetcher.updateUnwindTransactions();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  } finally {
    // Reset the lock variable to false to allow subsequent requests
    isUpdateUnwindTransactionsRunning = false;
  }
}

module.exports = {
  updateBuildTransactions,
  updateUnwindTransactions,
};
