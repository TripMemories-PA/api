import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { PostImageFactory } from './post_image_factory.js'
import { CommentFactory } from './comment_factory.js'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    const image = await PostImageFactory.create()

    return {
      createdById: faker.number.int(),
      poiId: 3407, // Arc de Triomphe
      imageId: image.id,
      content: faker.lorem.paragraph(),
      title: faker.lorem.words({ min: 3, max: 4 }),
      note: faker.number.float({
        min: 0,
        max: 5,
        fractionDigits: 1,
      }),
    }
  })
  .relation('comments', () => CommentFactory)
  .build()
