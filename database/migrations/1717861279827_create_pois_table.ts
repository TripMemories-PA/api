import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pois'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.integer('cover_id').unsigned().references('upload_files.id')
      table.integer('type_id').unsigned().references('poi_types.id')
      table.decimal('latitude', 8, 6).notNullable()
      table.decimal('longitude', 9, 6).notNullable()
      table.string('reference').notNullable()
      table.string('city').notNullable()
      table.string('zip_code').notNullable()
      table.string('address').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
