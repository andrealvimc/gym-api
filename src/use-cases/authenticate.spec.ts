import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate UseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@alvim.net",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "john@alvim.net",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("it should not be possible to authenticate with the wrong e-mail", async () => {
    await expect(() =>
      sut.execute({
        email: "john@alvim.ne2t",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("it should not be possible to authenticate with the wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@alvim.net",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john@alvim.net",
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
