import test from "japa"
import { request } from "Test/utils"
import Database from "@ioc:Adonis/Lucid/Database"

import { UserFactory } from "Database/factories"

test.group("/auth", (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test("[store] - is able to authenticate with credentials", async (assert) => {
    const user = await UserFactory.merge({ password: "secret" }).create()

    const { body, statusCode } = await request.post("/auth").send({
      email: user.email,
      password: "secret"
    })

    assert.equal(statusCode, 200)
    assert.exists(body.token)
  })

  test("[store] - token needs to be deleted after logout", async (assert) => {
    const user = await UserFactory.merge({ password: "secret" }).create()

    const { body } = await request.post("/auth").send({
      email: user.email,
      password: "secret"
    })

    const { statusCode } = await request
      .delete("/auth")
      .set("Authorization", `bearer ${body.token}`)

    assert.equal(statusCode, 410)
  })
})
