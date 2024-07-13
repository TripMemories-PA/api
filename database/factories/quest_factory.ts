import factory from '@adonisjs/lucid/factories'
import Quest from '#models/quest'
import { QuestImageFactory } from './quest_image_factory.js'

export const QuestFactory = factory
  .define(Quest, async ({ faker }) => {
    const image = await QuestImageFactory.create()
    return {
      title: faker.lorem.words(3),
      imageId: image.id,
      poiId: faker.number.int(),
      label: 'Mona Lisa',
    }
  })
  .build()
