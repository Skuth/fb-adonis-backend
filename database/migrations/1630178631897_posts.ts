import BaseSchema from "@ioc:Adonis/Lucid/Schema"

export default class Posts extends BaseSchema {
  protected tableName = "posts"

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary()

      table.text("description", "longtext")
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true })
      table.timestamp("updated_at", { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
