import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { StoreValidator, UpdateValidator } from "App/Validators/Post/Main"
import { User, Post } from "App/Models"
import Application from "@ioc:Adonis/Core/Application"
import fs from "fs"

export default class PostsController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.all()

    const user = (await User.findBy("username", username)) || auth.user!

    await user.load("posts", (query) => {
      query.orderBy("id", "desc")

      query.preload("media")

      query.preload("user", (query) => {
        query.select(["id", "name", "username"])
        query.preload("avatar")
      })

      query.withCount("comments")

      query.preload("comments", (query) => {
        query.select(["userId", "id", "content", "createdAt", "updatedAt"])
        query.preload("user", (query) => {
          query.select(["id", "name", "username"])
          query.preload("avatar")
        })
      })

      query.withCount("reactions", (query) => {
        query.where("type", "like")
        query.as("like_count")
      })

      query.withCount("reactions", (query) => {
        query.where("type", "love")
        query.as("love_count")
      })

      query.withCount("reactions", (query) => {
        query.where("type", "haha")
        query.as("haha_count")
      })

      query.withCount("reactions", (query) => {
        query.where("type", "sad")
        query.as("sad_count")
      })

      query.withCount("reactions", (query) => {
        query.where("type", "angry")
        query.as("angry_count")
      })

      query.preload("reactions", () => {
        query.where("userId", auth.user!.id).first()
      })
    })

    return user.posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related("posts").create(data)

    return post
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const { id: postId } = params

    const data = await request.validate(UpdateValidator)
    const post = await Post.findOrFail(postId)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    post.merge(data)

    await post.save()

    return post
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const { id: postId } = params

    const post = await Post.findOrFail(postId)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.load("media")

    if (post.media) {
      await post.media.delete()

      fs.unlinkSync(Application.tmpPath("uploads", post.media.fileName))
    }

    await post.delete()

    return response.gone()
  }
}
