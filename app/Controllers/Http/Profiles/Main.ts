import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

import { isFollowing } from "App/Utils"

import { User } from "App/Models"

export default class ProfilesController {
  public async show({ request, response, auth }: HttpContextContract) {
    const { username } = request.all()

    if (!username) {
      return response.badRequest({
        error: {
          message: "Missing username!"
        }
      })
    }

    const user = await User.query()
      .preload("avatar")
      .withCount("posts")
      .withCount("followers")
      .withCount("following")
      .where({ username })
      .first()

    if (!user) {
      return response.notFound({
        error: {
          message: "User not founded!"
        }
      })
    }

    if (user.id !== auth.user!.id) {
      await isFollowing(user, auth)
    }

    return user.serialize({
      fields: {
        omit: ["email", "createdAt", "updatedAt", "rememberMeToken"]
      }
    })
  }
}
