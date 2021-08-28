import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { StoreValidator, UpdateValidator } from "App/Validators/User/ForgotPassword"
import { User, UserKey } from "App/Models"
import Mail from "@ioc:Adonis/Addons/Mail"
import faker from "faker"

export default class UserForgotPasswordController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    const user = await User.findByOrFail("email", email)

    const key = `${faker.datatype.uuid()}${user.id}`

    user.related("keys").create({ key })

    const link = `${redirectUrl.replace(/\/$/, "")}/${key}`

    await Mail.send((message) => {
      message.to(email)
      message.from("contato@facebook.com", "Facebook")
      message.subject("Recuperação de senha")
      message.htmlView("emails/forgot-password", { link })
    })
  }

  public async show({ params }: HttpContextContract) {
    const { key } = params

    const userKey = await UserKey.findByOrFail("key", key)
    await userKey.load("user")

    return userKey.user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail("key", key)
    const user = await userKey.related("user").query().firstOrFail()

    user.merge({
      password: password
    })

    await user.save()
    await userKey.delete()

    return response.ok({ message: "Ok" })
  }
}
