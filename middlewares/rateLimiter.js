const moment = require('moment');
const path = require('path');

const WINDOW_SIZE_IN_MIN = 1;
const MAX_WINDOW_REQUEST_COUNT = process.env.MAX_WINDOW_REQUEST_COUNT;
const WINDOW_LOG_INTERVAL_IN_MIN = 1;

class RateLimiter {
    constructor(redis) {
        this.redisClient = redis;
    }

    checkAndUpdateUserRequest(userId) {
        return new Promise((resolve, reject) => {
            try {
                let _this = this;
                // check that redis client exists
                if (!_this.redisClient) {
                    return reject('Redis client does not exist!');
                }

                // fetch records of current user using userId, returns null when no record is found
                _this.redisClient.get(userId, function (err, record) {
                    if (err) throw err;
                    const currentRequestTime = new moment();
                    //  if no record is found , create a new record for user and store to redis
                    if (record == null) {
                        let newRecord = [];
                        let requestLog = {
                            requestTimeStamp: currentRequestTime.unix(),
                            requestCount: 1
                        };
                        newRecord.push(requestLog);
                        _this.redisClient.set(userId, JSON.stringify(newRecord));
                        return resolve(1)
                    }
                    // if record is found, parse it's value and calculate number of requests users has made within the last window
                    let data = JSON.parse(record);
                    let windowStartTimestamp = moment()
                        .subtract(WINDOW_SIZE_IN_MIN, 'minute')
                        .unix();
                    let requestsWithinWindow = data.filter(entry => {
                        return entry.requestTimeStamp > windowStartTimestamp;
                    });
                    let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                        return accumulator + entry.requestCount;
                    }, 0);
                    // if number of requests made is greater than or equal to the desired maximum, return error
                    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
                        return reject("user has passed the limit of requests per min - please wait a little bit and then try again");
                    } else {
                        let lastRequestLog = data[data.length - 1];
                        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                            .subtract(WINDOW_LOG_INTERVAL_IN_MIN, 'minute')
                            .unix();
                        //  if interval has not passed since last request log, increment counter
                        if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                            lastRequestLog.requestCount++;
                            data[data.length - 1] = lastRequestLog;
                        } else {
                            //  if interval has passed, log new entry for current user and timestamp
                            data.push({
                                requestTimeStamp: currentRequestTime.unix(),
                                requestCount: 1
                            });
                        }
                        _this.redisClient.set(userId, JSON.stringify(data));
                        return resolve(1)
                    }
                });
            } catch (error) {
                console.log(error)
                return reject(error)
            }
        });
    }
}


module.exports = (redis) => {
    return new RateLimiter(redis);
}
