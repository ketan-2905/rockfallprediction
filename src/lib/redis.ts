import { createClient } from "redis";

export const redis = createClient({
  socket: {
    host: "redis-17062.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 17062,
  },
  username: "default",
  password: "u93GL9IpaijjwI1XHZ7RnC0OnnJMYyq4",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
})();
