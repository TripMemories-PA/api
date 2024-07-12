import factory from '@adonisjs/lucid/factories'
import Meet from '#models/meet'
import { DateTime } from 'luxon'
import Ticket from '#models/ticket'

export const MeetTicketFactory = factory
  .define(Meet, async ({ faker }) => {
    const ticket = await Ticket.query().orderByRaw('RANDOM()').first()

    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      size: ticket!.groupSize,
      date: DateTime.fromJSDate(faker.date.soon({ days: 7 })),
      createdById: faker.number.int(),
      poiId: faker.number.int(),
      ticketId: ticket!.id,
      price: ticket!.price,
      channel: faker.string.uuid(),
    }
  })
  .build()
