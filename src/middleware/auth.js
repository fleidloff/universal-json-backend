import md5 from "md5";
import { users } from "../../config/config.js";

export default function auth(req, res, next) {
  // do something
  if (!req.headers["x-user"] || !req.headers["x-secret"]) {
    return res.send(401);
  }
  if (users[req.headers["x-user"]] !== md5(req.headers["x-secret"])) {
    return res.send(401);
  }
  return next();
}

export function unless(path, middleware) {
  return function (req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

export function getSecret(req, res) {
  res.send({ secret: md5(req.headers["x-password"]) });
}
