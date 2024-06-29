import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists.error";
import { AuthenticateUseCase } from "@/use-cases/authenticate.use-case";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials.error";

export async function Authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    const { user } = await authenticateUseCase.execute({ email, password });

    // return user;
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: e.message });
    }

    throw e;
    // return reply.status(500).send();
  }

  return reply.status(200).send();
}
