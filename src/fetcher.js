const fetcher = {};
const { execute } = require('../.graphclient');
const referralProgramDataSchema = require('../schemas/referralProgramData.schema');
const accounts = require("../schemas/account.schema");
const { getReferral } = require('./helper')
const Decimal = require('decimal.js');

async function checkSumOfRewards() {
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

    const reward = aggregation[0].reward
    const discount = aggregation[0].discount

    const rpd = await referralProgramDataSchema.findOne({ RPD: "RPD" }).exec()
    const totalFees = rpd.totalRewardsAvailableForClaim

    if (totalFees !== reward + discount) {
        console.log("test not passing", {totalFees, reward, discount})
        return false
    } else {
        return true
    }
}

fetcher.updateBuildTransactions = async () => {
    // todo check totalamount = sum of rewards
    await checkSumOfRewards();
    let timestamp = 0;
    await referralProgramDataSchema.findOne({ RPD: "RPD" }).then(async (value) => {
        // timestamp = value.lastUpdate.build
    })
    console.log("timestamp", timestamp)
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
        console.log("number of builds", result.data.builds.length)
        if (result.data.builds.length === 5000) {
            // todo run again the code
        }
        return result
    }

    const result = await queryBuilds()
        .catch((e) => console.error(`Failed to run queryBuilds:`, e))
        .then(data => {return data.data ?? null})

    if (result) {
        const buildTxs = result.builds ?? undefined
        if (buildTxs.length > 0) {
            const referral = getReferral()
            for (const build of buildTxs) {
                const collateral = new Decimal(build.collateral);
                const leverage = new Decimal(build.position.leverage);
                const notional = collateral.times(leverage);
                const tradingFeeRate = new Decimal(build.position.market.tradingFeeRate);
                const riskParamTradingFee = tradingFeeRate.div(new Decimal(1e18))
                const userTradingFee = notional.times(riskParamTradingFee);
                // check if calculated userTradingFee is the same as on the subgraph
                if (Math.abs(userTradingFee - build.feeAmount) > 1) {
                    console.log("calculated user trading fees is not equal to subgraph's", {notional, buildFeeAmount: build.feeAmount, tradingFeeRate, riskParamTradingFee, userTradingFee, diff: userTradingFee - build.feeAmount, txId: build.transaction.id, collateral: build.collateral, leverage: leverage})
                    continue;
                }
                await referral.setBuildLastUpdate(build.timestamp)

                await referral.updateReferral(userTradingFee / 1e18, build.owner.id, build.timestamp);
            }
        } else {
            return `no build tx found from timestamp ${timestamp}`
        }
        // todo check totalamount = sum of rewards
    }
    await checkSumOfRewards();
    return result
    return `successfully updated rewards for build Txs until timestamp ${timestamp}`
}; 

fetcher.updateUnwindTransactions = async () => {
    let timestamp = 0;
    await referralProgramDataSchema.findOne({ RPD: "RPD" }).then(async (value) => {
        // timestamp = value.lastUpdate.unwind
    })
    console.log("timestamp", timestamp)
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
        console.log("number of unwinds", result.data.unwinds.length)
        if (result.data.unwinds.length === 5000) {
            // todo run again the code
        }
        return result
    }

    const result = await queryUnwinds()
        .catch((e) => console.error(`Failed to run queryUnwinds:`, e))
        .then(data => {return data.data ?? null})

    if (result) {
        const unwindTxs = result.unwinds ?? undefined
        if (unwindTxs.length > 0) {
            const referral = getReferral()
            for (const unwind of unwindTxs) {
                await referral.setUnwindLastUpdate(unwind.timestamp)
                await referral.updateReferral(unwind.feeAmount / 1e18, unwind.owner.id, unwind.timestamp);
            }
        } else {
            return `no unwind tx found from timestamp ${timestamp}`
        }
        // todo check totalamount = sum of rewards
    }
    return result
    return `successfully updated rewards for unwind Txs until timestamp ${timestamp}`
}; 

module.exports = fetcher;
