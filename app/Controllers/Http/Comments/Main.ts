import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { StoreValidator, UpdateValidator } from "App/Validators/Comment/Main"
import { Post, Comment } from "App/Models"

export default class CommentsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { content, postId } = await request.validate(StoreValidator)

    const post = await Post.find(postId)

    if (!post) {
      return response.notFound({
        error: {
          message: "Post not founded!"
        }
      })
    }

    const comment = await post.related("comments").create({ content, userId: auth.user!.id })

    return comment
  }

  public async update({ request, response, auth, params }: HttpContextContract) {
    const { content } = await request.validate(UpdateValidator)

    const comment = await Comment.find(params.id)

    if (!comment) {
      return response.notFound({
        error: {
          message: "Comment not founded!"
        }
      })
    }

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }

    comment.merge({ content })

    await comment.save()

    return comment
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    const comment = await Comment.find(params.id)

    if (!comment) {
      return response.notFound({
        error: {
          message: "Comment not founded!"
        }
      })
    }

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }

    await comment.delete()

    return response.gone()
  }
}
