import bodyParser from "body-parser";
import restana from "restana";
import md5 from "md5";
import { port } from "../config/config.js";
import bootstrapDbClient from "./dbClient.js";

const users = {
  fred: "3173700ce0d5803b8566d2bf06a5a90b",
};
async function bootstrapServer() {
  const service = restana();
  service.use(bodyParser.json());

  const dbClient = await bootstrapDbClient();

  service.use((req, res, next) => {
    // do something
    if (users[req.headers.user] !== md5(req.headers.secret)) {
      return res.send(401);
    }
    return next();
  });

  service
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
      res.end();
    })
    .put("/:collection/:id", async (req, res) => {
      await dbClient.update(req.params.collection, req.params.id, req.body);
      res.end();
    });

  const server = await service.start(port);

  return server;
}

export default bootstrapServer;
