import factory from '@adonisjs/lucid/factories'
import Answer from '#models/answer'

export const AnswerFactory = factory
  .define(Answer, async ({ faker }) => {
    return {
      answer: faker.lorem.words({
        min: 1,
        max: 3,
      }),
      isCorrect: faker.datatype.boolean(),
      questionId: faker.number.int(),
    }
  })
  .build()
