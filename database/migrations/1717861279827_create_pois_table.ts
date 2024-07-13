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
      table.string('reference').nullable()
      table.integer('city_id').unsigned().references('cities.id')
      table.string('address').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('users', (table) => {
      table.integer('poi_id').unsigned().nullable().references('pois.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.alterTable('users', (table) => {
      table.dropColumn('poi_id')
    })
  }
}
