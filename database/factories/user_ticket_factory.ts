import factory from '@adonisjs/lucid/factories'
import UserTicket from '#models/user_ticket'
import Ticket from '#models/ticket'
import { DateTime } from 'luxon'

export const UserTicketFactory = factory
  .define(UserTicket, async ({ faker }) => {
    const randomTicket = await Ticket.query().orderByRaw('RANDOM()').first()

    return {
      paid: true,
      piId: faker.string.uuid(),
      qrCode: faker.string.uuid(),
      ticketId: randomTicket!.id,
      userId: faker.number.int(),
      price: randomTicket!.price,
      paidAt: DateTime.fromJSDate(faker.date.past()),
    }
  })
  .build()
