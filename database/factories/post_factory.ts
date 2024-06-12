import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { PostImageFactory } from './post_image_factory.js'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    const image = await PostImageFactory.create()

    return {
      createdById: faker.number.int(),
      poiId: 3407,
      imageId: image.id,
      content: faker.lorem.paragraph(),
      note: faker.number.float({
        min: 0,
        max: 5,
        fractionDigits: 1,
      }),
    }
  })
  .build()
