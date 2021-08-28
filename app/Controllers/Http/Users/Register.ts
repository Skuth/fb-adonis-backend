import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { StoreValidator, UpdateValidator } from "App/Validators/User/Register"
import { User, UserKey } from "App/Models"
import faker from "faker"
import Mail from "@ioc:Adonis/Addons/Mail"
import removeAccents from "remove-accents"
import Database from "@ioc:Adonis/Lucid/Database"

export default class UserRegistersController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = new User()

      user.useTransaction(trx)

      user.email = email

      await user.save()

      const key = `${faker.datatype.uuid()}${user.id}`

      user.related("keys").create({ key })

      const link = `${redirectUrl.replace(/\/$/, "")}/${key}`

      await Mail.send((message) => {
        message.to(email)
        message.from("contato@facebook.com", "Facebook")
        message.subject("Criação de conta")
        message.htmlView("emails/verify-email", { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const { key } = params

    const userKey = await UserKey.findByOrFail("key", key)
    await userKey.load("user")

    return userKey.user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail("key", key)
    const user = await userKey.related("user").query().firstOrFail()

    const username = removeAccents(
      `${String(name).trim().split(" ")[0].toLowerCase()}${new Date().getTime()}`
    )

    user.merge({
      name,
      password,
      username,
      isActive: true
    })

    await user.save()
    await userKey.delete()

    return response.ok({ message: "Ok" })
  }
}
