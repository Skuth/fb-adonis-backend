import { User } from "App/Models"
import Factory from "@ioc:Adonis/Lucid/Factory"
import { PostFactory } from "Database/factories"

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    name: faker.name.findName()
  }
})
  .relation("posts", () => PostFactory)
  .build()
