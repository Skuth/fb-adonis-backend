import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Application from "@ioc:Adonis/Core/Application"

export default class UploadController {
  public async show({ params, response }: HttpContextContract) {
    return response.download(Application.tmpPath("uploads", params.file))
  }
}
