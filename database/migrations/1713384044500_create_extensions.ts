import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await db.rawQuery('CREATE EXTENSION IF NOT EXISTS postgis')
  }

  async down() {
    await db.rawQuery('DROP EXTENSION IF EXISTS postgis')
  }
}
