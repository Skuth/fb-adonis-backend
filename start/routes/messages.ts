import Routes from "@ioc:Adonis/Core/Route"

Routes.post("/messages", "Messages/Main.store").middleware("auth")
