import Route from "@ioc:Adonis/Core/Route"

import "./auth"
import "./users"
import "./follows"
import "./profiles"
import "./uploads"
import "./posts"
import "./comments"
import "./reactions"
import "./messages"
import "./conversations"

Route.get("/", async ({ response }) => {
  return response.ok({
    message: "Ok!"
  })
})

Route.get("/user-register", async ({ view }) => {
  return view.render("emails/register")
})
