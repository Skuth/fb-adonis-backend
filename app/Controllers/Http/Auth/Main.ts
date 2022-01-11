import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { StoreValidator } from "App/Validators/Auth"

export default class AuthController {
  public async store({ request, auth }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    const token = await auth.attempt(email, password, {
      expiresIn: "30d"
    })

    return token
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.gone()
  }
}
