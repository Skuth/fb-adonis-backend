import BaseSchema from "@ioc:Adonis/Lucid/Schema"

export default class Messages extends BaseSchema {
  protected tableName = "messages"

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary()

      table.text("content", "longtext").notNullable()

      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      table
        .integer("conversation_id")
        .unsigned()
        .references("conversations.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      table.timestamp("created_at", { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
