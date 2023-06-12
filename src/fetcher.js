const fetcher = {};
const { execute } = require('../.graphclient');
const referralProgramDataSchema = require('../schemas/referralProgramData.schema');
const accounts = require("../schemas/account.schema");
const { getReferral } = require('./helper')
const Decimal = require('decimal.js');

async function checkSumOfRewards() {
  // Aggregate sum of rewards and discounts from accounts collection
    const aggregation = await accounts.aggregate([
        {
          '$group': {
            '_id': null, 
            'reward': {
              '$sum': '$reward'
            }, 
            'discount': {
              '$sum': '$discount'
            }
          }
        }
      ]).exec()

    // Extract reward and discount from the aggregation result
    const reward = aggregation[0].reward
    const discount = aggregation[0].discount

    // Find referral program data from the schema
    const rpd = await referralProgramDataSchema.findOne({ RPD: "RPD" }).exec()
    // Get the total rewards available for claim from referral program data
    const totalFees = rpd.totalRewardsAvailableForClaim

    // Check if the sum of reward and discount matches the total fees
    if (totalFees !== reward + discount) {
        console.log("test not passing", {totalFees, reward, discount})
        // TODO handle error
        return false
    } else {
        return true
    }
}

fetcher.updateBuildTransactions = async () => {
  // Check if the sum of rewards and discounts matches the total fees
    await checkSumOfRewards();

    // intialize timestamp
    let timestamp = 0;
    await referralProgramDataSchema.findOne({ RPD: "RPD" }).then(async (value) => {
        timestamp = value.lastUpdate.build
    })

    const myQuery = `
    query BuildQuery($timestampFrom: String!) {
        builds(first: 5000, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: $timestampFrom}) {
          owner {
            id
          }
          collateral
          timestamp
          feeAmount
          transaction {
            id
          }
          position {
            market {
              tradingFeeRate
            }
            leverage
          }
        }
      }
    `
    const queryVar = {timestampFrom: `${timestamp}`}

    async function queryBuilds() {
        const result = await execute(myQuery, queryVar)
        if (result.data.builds.length === 5000) {
            // todo run again the code
        }
        return result
    }

    // Execute the build query
    const result = await queryBuilds()
        .catch((e) => console.error(`Failed to run queryBuilds:`, e))
        .then(data => {return data.data ?? null})

    // Process the result if it exists
    if (result) {
        const buildTxs = result.builds ?? undefined
        if (buildTxs.length > 0) {
            const referral = getReferral()
            // itereate through each build tx
            for (const build of buildTxs) {
                const collateral = new Decimal(build.collateral);
                const leverage = new Decimal(build.position.leverage);
                // notional = collateral * leverage
                const notional = collateral.times(leverage);
                const tradingFeeRate = new Decimal(build.position.market.tradingFeeRate);
                const riskParamTradingFee = tradingFeeRate.div(new Decimal(1e18))
                // userTradingFee = notional * trading fee %
                const userTradingFee = notional.times(riskParamTradingFee);
                // check if calculated userTradingFee is the same as on the subgraph
                if (Math.abs(userTradingFee - build.feeAmount) > 1) {
                    // todo handle error
                    console.log("calculated user trading fees is not equal to subgraph's", {notional, buildFeeAmount: build.feeAmount, tradingFeeRate, riskParamTradingFee, userTradingFee, diff: userTradingFee - build.feeAmount, txId: build.transaction.id, collateral: build.collateral, leverage: leverage})
                    continue;
                }

                // Update referral last update - before updateReferral to prevent duplications if it fails
                await referral.setBuildLastUpdate(build.timestamp)

                // Call updateReferral handler with trading fee, sender address, and tx timestamp
                await referral.updateReferral(userTradingFee / 1e18, build.owner.id, build.timestamp);
            }
        } else {
            return `no build tx found from timestamp ${timestamp}`
        }
    }
    // Check if the sum of rewards and discounts still matches the total fees after processing build transactions
    await checkSumOfRewards();

    // TODO update return
    return result
    return `successfully updated rewards for build Txs until timestamp ${timestamp}`
}; 

fetcher.updateUnwindTransactions = async () => {
  // Check if the sum of rewards and discounts matches the total fees
  await checkSumOfRewards();

    // intialize timestamp
    let timestamp = 0;

    await referralProgramDataSchema.findOne({ RPD: "RPD" }).then(async (value) => {
        timestamp =  value.lastUpdate.unwind
    })
    const myQuery = `
    query MyQuery($timestampFrom: String!) {
        unwinds(first: 5000, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: $timestampFrom}) {
          owner {
            id
          }
          timestamp
          feeAmount
        }
      }
    `
    const queryVar = {timestampFrom: `${timestamp}`}

    async function queryUnwinds() {
        const result = await execute(myQuery, queryVar)
        if (result.data.unwinds.length === 5000) {
            // todo run again the code
        }
        return result
    }

    // Execute the build query
    const result = await queryUnwinds()
        .catch((e) => console.error(`Failed to run queryUnwinds:`, e))
        .then(data => {return data.data ?? null})

    // Process the result if it exists
    if (result) {
        const unwindTxs = result.unwinds ?? undefined
        if (unwindTxs.length > 0) {
            const referral = getReferral()
            for (const unwind of unwindTxs) {
                // Update referral last update - before updateReferral to prevent duplications if it fails
                await referral.setUnwindLastUpdate(unwind.timestamp)

                // Call updateReferral handler with trading fee, sender address, and tx timestamp
                await referral.updateReferral(unwind.feeAmount / 1e18, unwind.owner.id, unwind.timestamp);
            }
        } else {
            return `no unwind tx found from timestamp ${timestamp}`
        }
    }
    // Check if the sum of rewards and discounts still matches the total fees after processing build transactions
    await checkSumOfRewards();

    // TODO update return
    return result
    return `successfully updated rewards for unwind Txs until timestamp ${timestamp}`
}; 

module.exports = fetcher;
