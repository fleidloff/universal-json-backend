const axios = require("axios").default;

module.exports = function bootstrapClient(url, collection) {
  const instance = axios.create();

  function headers({ secret, user }) {
    return {
      ["x-user"]: user,
      ["x-secret"]: secret,
      accept: "*/*",
      ["content-type"]: "application/json",
    };
  }

  return {
    user: "someone",
    secret: "some secret",
    get: async (criteria) => {
      if (criteria) {
        return await axios({
          url: `${url}/${collection}/criteria`,
          data: criteria,
          method: "POST",
          headers: headers(this),
        });
      } else {
        return await axios({
          url: `${url}/${collection}`,
          method: "GET",
          headers: headers(this),
        });
      }
    },
    getById: async (id) =>
      await axios({
        url: `${url}/${collection}/${id}`,
        method: "GET",
        headers: headers(this),
      }),
    add: async (item) =>
      await axios({
        url: `${url}/${collection}`,
        method: "POST",
        data: item,
        headers: headers(this),
      }),
    remove: async (id) =>
      await axios({
        url: `${url}/${collection}/${id}`,
        method: "DELETE",
        headers: headers(this),
      }),
    update: async (id, update) =>
      await axios({
        url: `${url}/${collection}/${id}`,
        method: "PUT",
        data: update,
        headers: headers(this),
      }),
    auth: (user, secret) => {
      this.user = user;
      this.secret = secret;
    },
  };
};
