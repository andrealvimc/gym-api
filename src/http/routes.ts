import { FastifyInstance } from "fastify";
import { Register } from "./controllers/register.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", Register);
}
