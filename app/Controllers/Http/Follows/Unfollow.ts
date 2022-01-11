import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

import { StoreValidator } from "App/Validators/Follows/Main"

import { isFollowing } from "App/Utils"

import { User } from "App/Models"

export default class UnfollowController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { followingId } = await request.validate(StoreValidator)

    const user = await User.find(followingId)

    if (!user) {
      return response.notFound({
        error: {
          message: "User not founded!"
        }
      })
    }

    if (user.id === auth.user!.id) {
      return response.badRequest({
        error: {
          message: "You cannot unfollow yourself!"
        }
      })
    }

    const isUserFollowing = await isFollowing(user, auth)

    if (!isUserFollowing) {
      return response.badRequest({
        error: {
          message: "You are not following this user!"
        }
      })
    }

    await user.related("followers").detach([auth.user!.id])
  }
}
