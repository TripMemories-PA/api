import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.integer('size').notNullable()
      table.datetime('date').notNullable()
      table.integer('price').nullable()

      table
        .integer('created_by_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('poi_id').unsigned().references('id').inTable('pois').notNullable()

      table.integer('ticket_id').unsigned().references('id').inTable('tickets').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('meets_users', (table) => {
      table.increments('id')
      table
        .integer('meet_id')
        .unsigned()
        .references('id')
        .inTable('meets')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['meet_id', 'user_id'])
      table.boolean('is_banned').defaultTo(false)
      table.boolean('has_paid').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('user_tickets', (table) => {
      table
        .integer('meet_id')
        .unsigned()
        .references('id')
        .inTable('meets')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable('meets_users')
    this.schema.alterTable('user_tickets', (table) => {
      table.dropColumn('meet_id')
    })
  }
}
