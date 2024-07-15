import { QuestFactory } from '#database/factories/quest_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const countQuests = 10
    const defaultPoiId = 868 // Louvre

    await QuestFactory.merge({
      poiId: defaultPoiId,
    }).createMany(countQuests)
  }
}
