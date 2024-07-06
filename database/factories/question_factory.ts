import factory from '@adonisjs/lucid/factories'
import Question from '#models/question'
import { QuestionImageFactory } from './question_image_factory.js'

export const QuestionFactory = factory
  .define(Question, async ({ faker }) => {
    return {
      question: faker.lorem.sentence() + ' ?',
      poiId: faker.number.int(),
    }
  })
  .relation('image', () => QuestionImageFactory)
  .build()
