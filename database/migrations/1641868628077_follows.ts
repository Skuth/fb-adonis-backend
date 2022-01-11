import BaseSchema from "@ioc:Adonis/Lucid/Schema"

export default class Follows extends BaseSchema {
  protected tableName = "follows"

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary()

      table
        .integer("follower_id")
        .unsigned()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      table
        .integer("following_id")
        .unsigned()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      table.timestamp("created_at", { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
