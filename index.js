const express = require('express');
const bodyParser = require("body-parser");
const db = require("./models/db")
const app = express()

const port = process.env.PORT
const response = require('./routes/response');
const redis = require('redis');
const redisClient = redis.createClient();
const redisRateLimiter = require('./middlewares/rateLimiter');

app.use(express.static(__dirname + '/statics'));

app.listen(port, () => {
    console.log(`******************************`);
    console.log('   env:', process.env.NODE_ENV);
    console.log(`   listening on port: ${port}`);
    console.log(`******************************`);
})

app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-username");

    let userId = req.headers['x-username'] ? req.headers['x-username'] : null;
    if (userId) {
        if (req.method === 'POST') {
            try {
                await redisRateLimiter(redisClient).checkAndUpdateUserRequest(userId);
                next();
            } catch (e) {
                return response.error(res, e);
            }
        } else {
            next();
        }
    } else {
        return response.error(res, "USER ID was not provided!", 401);
    }
});


app.use('/api/image', require('./routes/imageRouter')(db));

