import { PaginateRequest } from '../paginate_request.js'

export interface IndexCommentRequest extends PaginateRequest {
  sortBy?: string
}
