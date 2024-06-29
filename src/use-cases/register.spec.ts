import { compare } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.repository";
import { test, expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register.use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register UseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@alvim.net",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
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
    const email = "john@alvim.net";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
