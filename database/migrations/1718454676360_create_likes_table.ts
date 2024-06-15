import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('comment_likes', (table) => {
      table.increments('id')

      table
        .integer('comment_id')
        .unsigned()
        .references('id')
        .inTable('comments')
        .onDelete('CASCADE')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('post_likes', (table) => {
      table.increments('id')

      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('comment_likes')
    this.schema.dropTable('post_likes')
  }
}
