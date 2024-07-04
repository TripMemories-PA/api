import factory from '@adonisjs/lucid/factories'
import Ticket from '#models/ticket'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      quantity: faker.number.int({
        min: 10,
        max: 100,
      }),
      price: faker.number.int({
        min: 500,
        max: 2500,
      }),
      groupSize: faker.number.int({
        min: 1,
        max: 10,
      }),
      poiId: faker.number.int(),
    }
  })
  .build()
