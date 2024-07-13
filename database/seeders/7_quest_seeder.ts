import { QuestFactory } from '#database/factories/quest_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const countQuests = 10
    const defaultPoiId = 1775

    await QuestFactory.merge({
      poiId: defaultPoiId,
    }).createMany(countQuests)
  }
}
