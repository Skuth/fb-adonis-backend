import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

import { UpdateValidator } from "App/Validators/Reactions/Main"

import { Post, Reaction } from "App/Models"

export default class ReactionsController {
  public async update({ request, response, auth }: HttpContextContract) {
    const { type, postId } = await request.validate(UpdateValidator)

    const post = await Post.find(postId)

    if (!post) {
      return response.notFound({
        error: {
          message: "Post not founded!"
        }
      })
    }

    const reaction = await post
      .related("reactions")
      .updateOrCreate({ postId, userId: auth.user!.id }, { type })

    return reaction
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const reaction = await Reaction.find(params.id)

    if (!reaction) {
      return response.notFound({
        error: {
          message: "Reaction not founded!"
        }
      })
    }

    if (reaction.userId !== auth.user!.id) {
      return response.unauthorized()
    }

    await reaction.delete()

    return response.gone()
  }
}
