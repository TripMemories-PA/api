import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email').notNullable().unique()
      table.string('username').notNullable().unique()
      table.string('password').notNullable()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('customer_id').nullable()
      table.decimal('latitude', 8, 6).nullable()
      table.decimal('longitude', 9, 6).nullable()
      table.integer('user_type_id').unsigned().notNullable().references('id').inTable('user_types')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
