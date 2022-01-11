import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

import { User } from "App/Models"

export default class FollowersController {
  public async index({ request, response }: HttpContextContract) {
    const { username } = request.all()

    if (!username) {
      return response.badRequest({
        error: {
          message: "Missing username!"
        }
      })
    }

    const user = await User.findBy("username", username)

    if (!user) {
      return response.notFound({
        error: {
          message: "User not founded!"
        }
      })
    }

    await user.load("followers")

    return user.followers
  }

  public async destroy({ auth, response, params }: HttpContextContract) {
    const user = auth.user!

    await user.related("followers").detach([params.id])

    return response.gone()
  }
}
