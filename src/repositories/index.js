import UserRepository from "./users.repository.js";

import factory from "../daos/factory.js";
const { UserDao } = factory

export const userRepository = new UserRepository(new UserDao())