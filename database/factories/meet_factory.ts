import factory from '@adonisjs/lucid/factories'
import Meet from '#models/meet'
import { DateTime } from 'luxon'

export const MeetFactory = factory
  .define(Meet, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      size: faker.number.int({ min: 2, max: 10 }),
      date: DateTime.fromJSDate(faker.date.soon({ days: 7 })),
      createdById: faker.number.int(),
      poiId: faker.number.int(),
    }
  })
  .build()
