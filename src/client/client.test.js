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
  expect(response?.data?.length).toBe(0);
});

let id;
test("addding an item", async () => {
  const response = await client.add({ foo: "bar" });
  id = response.data._id;
  expect(response?.data?.foo).toBe("bar");
});

test("find item by id", async () => {
  const response = await client.getById(id);
  expect(response?.data?.foo).toBe("bar");
});

test("find item by criteria", async () => {
  const response = await client.get({ foo: "bar" });
  expect(response?.data?.length).toBe(1);
  expect(response?.data[0]?.foo).toBe("bar");
});

test("update item", async () => {
  await client.update(id, { baz: "boo" });
  const response = await client.getById(id);
  expect(response?.data?.foo).toBe("bar");
  expect(response?.data?.baz).toBe("boo");
});

test("delete item", async () => {
  await client.remove(id);
  const response = await client.getById(id);
  expect(response?.data).toBe(undefined);
});

test("collection is empty at end of testing", async () => {
  const response = await client.get();
  expect(response.data.length).toBe(0);
});
