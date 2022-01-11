import Route from "@ioc:Adonis/Core/Route"

import "./auth"
import "./users"
import "./follows"
import "./profiles"
import "./uploads"
import "./posts"
import "./comments"
import "./reactions"

Route.get("/user-register", async ({ view }) => {
  return view.render("emails/register")
})
