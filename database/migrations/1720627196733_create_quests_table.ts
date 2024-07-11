import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.integer('image_id').unsigned().references('id').inTable('upload_files')
      table.integer('poi_id').unsigned().references('id').inTable('pois')
      table.string('label').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('quests_users', (table) => {
      table.increments('id')
      table.integer('quest_id').unsigned().references('id').inTable('quests').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.unique(['quest_id', 'user_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable('quests_users')
  }
}
