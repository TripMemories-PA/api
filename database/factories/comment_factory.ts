import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from './user_factory.js'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    const user = await UserFactory.merge({
      password: 'Test1234!',
    })
      .with('avatar')
      .with('banner')
      .create()

    return {
      createdById: user.id,
      postId: faker.number.int(),
      content: faker.lorem.paragraph(),
    }
  })
  .build()
