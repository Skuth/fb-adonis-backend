import Routes from "@ioc:Adonis/Core/Route"

Routes.get("/conversations", "Conversations/Main.index").middleware("auth")
Routes.get("/conversations/:id", "Conversations/Main.show").middleware("auth")
