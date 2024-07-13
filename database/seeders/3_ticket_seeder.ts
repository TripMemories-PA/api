import { TicketFactory } from '#database/factories/ticket_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const defaultPoiId = 1775 // Arc de Triomphe

    await TicketFactory.merge({
      poiId: defaultPoiId,
    }).createMany(3)
  }
}
