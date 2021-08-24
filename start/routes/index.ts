import Route from "@ioc:Adonis/Core/Route"

import "./auth"
import "./users"

Route.get("/user-register", async ({ view }) => {
  return view.render("emails/register")
})
