import bodyParser from "body-parser";
import restana from "restana";
import auth, { getSecret, unless } from "./middleware/auth.js";
import { port } from "../config/config.js";
import bootstrapDbClient from "./dbClient.js";

async function bootstrapServer() {
  const service = restana();
  service.use(bodyParser.json());
  service.use(unless("/secret", auth));

  const dbClient = await bootstrapDbClient();

  service
    .post("/secret", getSecret)
    .get("/:collection", async (req, res) => {
      const results = await dbClient.find(req.params.collection, {});
      res.send(results);
    })
    // todo: how to do this more rest style?
    .post("/:collection/criteria", async (req, res) => {
      const results = await dbClient.find(req.params.collection, req.body);
      res.send(results);
    })
    .get("/:collection/:id", async (req, res) => {
      const results = await dbClient.findById(
        req.params.collection,
        req.params.id
      );
      res.send(results);
    })
    .post("/:collection", async (req, res) => {
      const result = await dbClient.add(req.params.collection, req.body);
      res.send(result);
    })
    .delete("/:collection/:id", async (req, res) => {
      await dbClient.remove(req.params.collection, req.params.id);
      res.send(201);
    })
    .put("/:collection/:id", async (req, res) => {
      await dbClient.update(req.params.collection, req.params.id, req.body);
      res.send(201);
    });

  const server = await service.start(port, "0.0.0.0");

  return server;
}

export default bootstrapServer;
