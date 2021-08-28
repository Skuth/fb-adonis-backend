import Route from "@ioc:Adonis/Core/Route"

Route.post("/users/register", "Users/Register.store")
Route.get("/users/register/:key", "Users/Register.show")
Route.put("/users/register", "Users/Register.update")

Route.post("/user/forgot-password", "Users/ForgotPassword.store").middleware("auth")
Route.get("/user/forgot-password/:key", "Users/ForgotPassword.show").middleware("auth")
Route.put("/user/forgot-password/", "Users/ForgotPassword.update").middleware("auth")
