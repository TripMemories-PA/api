import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('created_by_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('poi_id').unsigned().references('id').inTable('pois').onDelete('CASCADE')
      table.text('content').notNullable()
      table.decimal('note', 2, 1).notNullable()
      table
        .integer('image_id')
        .unsigned()
        .references('id')
        .inTable('upload_files')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
