import { CreateAnswerRequest } from './create_answer_request.js'

export interface UpdateQuestionRequest {
  question?: string
  imageId?: number | null
  answers?: CreateAnswerRequest[]
}
