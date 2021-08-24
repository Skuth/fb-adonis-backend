import Route from "@ioc:Adonis/Core/Route"

Route.group(() => {
  Route.post("/", "Auth/Main.store")
  Route.delete("/", "Auth/Main.destroy").middleware("auth")
}).prefix("/auth")
