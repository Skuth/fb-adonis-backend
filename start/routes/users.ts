import Route from "@ioc:Adonis/Core/Route"

Route.post("/users/register", "Users/Register.store")
Route.get("/users/register/:key", "Users/Register.show")
Route.put("/users/register", "Users/Register.update")

Route.post("/users/forgot-password", "Users/ForgotPassword.store").middleware("auth")
Route.get("/users/forgot-password/:key", "Users/ForgotPassword.show").middleware("auth")
Route.put("/users/forgot-password/", "Users/ForgotPassword.update").middleware("auth")

Route.get("/users", "Users/Main.show").middleware("auth")
Route.put("/users", "Users/Main.update").middleware("auth")
