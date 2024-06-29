import { FastifyInstance } from "fastify";
import { Register } from "./controllers/register.controller";
import { Authenticate } from "./controllers/authenticate.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", Register);
  app.post("/session", Authenticate);
}
