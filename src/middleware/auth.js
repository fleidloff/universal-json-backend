import md5 from "md5";

const users = {
  fred: "3173700ce0d5803b8566d2bf06a5a90b",
};

export default function auth(req, res, next) {
  // do something
  if (users[req.headers.user] !== md5(req.headers.secret)) {
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
  res.send({ secret: md5(req.headers.password) });
}
