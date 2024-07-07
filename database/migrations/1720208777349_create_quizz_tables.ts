import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('questions', (table) => {
      table.increments('id')
      table.string('question', 255).notNullable()
      table
        .integer('image_id')
        .unsigned()
        .references('id')
        .inTable('upload_files')
        .onDelete('SET NULL')
      table.integer('poi_id').unsigned().references('id').inTable('pois').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('users', (table) => {
      table.integer('score').defaultTo(0)
    })

    this.schema.createTable('answers', (table) => {
      table.increments('id')
      table
        .integer('question_id')
        .unsigned()
        .references('id')
        .inTable('questions')
        .onDelete('CASCADE')
        .notNullable()
      table.string('answer', 255).notNullable()
      table.boolean('is_correct').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('questions')
    this.schema.dropTable('answers')
    this.schema.alterTable('users', (table) => {
      table.dropColumn('score')
    })
  }
}
