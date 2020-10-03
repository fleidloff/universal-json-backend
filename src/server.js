import bodyParser from "body-parser";
import restana from "restana";
import { port } from "../config/config.js";
import bootstrapDbClient from "./dbClient.js";

async function bootstrapServer() {
  const service = restana();
  service.use(bodyParser.json());

  const dbClient = await bootstrapDbClient();

  service
    .get("/:collection", async (req, res) => {
      const results = await dbClient.find(req.params.collection, {});
      res.send(results);
    })
    .get("/:collection/:id", async (req, res) => {
      const results = await dbClient.findById(
        req.params.collection,
        req.params.id
      );
      res.send(results);
    })
    .delete("/pets/:id", async (req, res) => {})
    .post("/pets/:name/:age", async (req, res) => {})
    .patch("/pets/:id", async (req, res) => {});

  service.use((req, res, next) => {
    // do something
    return next();
  });

  const server = await service.start(port);

  return server;
}

export default bootstrapServer;
