import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'upload_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('filename').notNullable()
      table.string('url').notNullable()
      table.string('mime_type').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('users', (table) => {
      table
        .integer('avatar_id')
        .unsigned()
        .references('upload_files.id')
        .nullable()
        .onDelete('SET NULL')

      table
        .integer('banner_id')
        .unsigned()
        .references('upload_files.id')
        .nullable()
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
