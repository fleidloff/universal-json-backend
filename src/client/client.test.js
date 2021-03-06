const bootstrapClient = require("./client.js");
const secrets = require("./config.js").secrets;

const client = bootstrapClient("http://localhost:8080", "test-collection");
const clientProd = bootstrapClient(
  "https://fleidlof.uber.space/node",
  "test-collection"
);

test("initial request fails if not authorized", async () => {
  try {
    const result = await client.get();
  } catch (e) {
    expect(e.response.status).toBe(401);
  }
});

test("collection is initially empty", async () => {
  client.auth("fred", secrets.fred);
  const response = await client.get();
  expect(response?.data?.length).toBe(0);
});

let id;
test("addding an item", async () => {
  const response = await client.add({ foo: "bar" });
  id = response?.data?._id;
  expect(id).not.toBe(undefined);
});

test("find item by id", async () => {
  console.log("find by id", id);
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
  expect(response?.status).toBe(200);
});

test("collection is empty at end of testing", async () => {
  const response = await client.get();
  expect(response.data.length).toBe(0);
});
