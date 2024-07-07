import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.integer('quantity').notNullable()
      table.integer('price').notNullable()
      table.integer('group_size').notNullable()
      table.boolean('available').notNullable().defaultTo(true)
      table.integer('poi_id').unsigned().references('id').inTable('pois')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
