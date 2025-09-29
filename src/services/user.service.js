import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUserById(id) {
  return await userRepository.findOne({
    where: { id },
    select: ["id", "email"], 
  });
}

export async function updateUser(id, changes) {
  const user = await userRepository.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");

  if (changes.email) {
    user.email = changes.email;
  }

  if (changes.password) {
    user.password = await bcrypt.hash(changes.password, 10);
  }

  const updatedUser = await userRepository.save(user);

  return { id: updatedUser.id, email: updatedUser.email };
}

export async function deleteUser(id) {
  const result = await userRepository.delete({ id });
  if (result.affected === 0) {
    throw new Error("Usuario no encontrado");
  }
}
