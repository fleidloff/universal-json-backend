const bootstrapClient = require("./client.js");

const client = bootstrapClient("http://localhost:8080", "test-collection");

test("initial request fails if not authorized", async () => {
  try {
    const result = await client.get();
  } catch (e) {
    expect(e.response.status).toBe(401);
  }
});

test("collection is initially empty", async () => {
  client.auth("fred", "15df34e17c3808f557161deb1acaae28");
  const response = await client.get();
  expect(response.data.length).toBe(0);
});
