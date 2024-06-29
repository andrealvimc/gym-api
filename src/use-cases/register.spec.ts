import { compare } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.repository";
import { test, expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register.use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

describe("Register UseCase", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john@alvim.net",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john@alvim.net",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "john@alvim.net";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
