const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("redis");

const redisClient = Redis.createClient({
  host: "localhost",
  port: 5173,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit",
  points: 10,
  duration: 1,
});

module.exports = rateLimiter;
