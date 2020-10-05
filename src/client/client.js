const axios = require("axios").default;

module.exports = function bootstrapClient(url, collection) {
  const instance = axios.create();

  function headers(o) {
    return {
      ["x-user"]: o.user,
      ["x-secret"]: o.secret,
      accept: "*/*",
    };
  }

  return {
    user: "someone",
    secret: "some secret",
    get: async (criteria) =>
      await axios({
        url: `${url}/${collection}`,
        method: "GET",
        headers: headers(this),
      }),
    getById: (id) => Promise.resolve(null),
    add: (item) => Promise.resolve(null),
    remove: (id) => Promise.resolve(false),
    update: (id, update) => Promise.resolve(false),
    auth: (user, secret) => {
      this.user = user;
      this.secret = secret;
    },
  };
};
