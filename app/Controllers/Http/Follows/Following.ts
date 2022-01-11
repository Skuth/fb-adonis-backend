import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

import { isFollowing } from "App/Utils"

import { User } from "App/Models"

export default class FollowingsController {
  public async index({ request, response, auth }: HttpContextContract) {
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

    await user.load("following")

    const queries = user.following.map(async (user) => {
      await isFollowing(user, auth)
    })

    await Promise.all(queries)

    return user.following
  }
}
