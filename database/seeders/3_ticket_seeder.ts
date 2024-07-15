import { TicketFactory } from '#database/factories/ticket_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const defaultPoiId = 868 // Louvre

    await TicketFactory.merge({
      poiId: defaultPoiId,
    }).createMany(3)
  }
}
