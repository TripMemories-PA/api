import { CreateAnswerRequest } from './create_answer_request.js'

export interface CreateQuestionRequest {
  question: string
  imageId: number | null
  poiId: number
  answers: CreateAnswerRequest[]
}
