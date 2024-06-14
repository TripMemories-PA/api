import { PaginateRequest } from '../paginate_request.js'

export interface IndexPostRequest extends PaginateRequest {
  sortBy?: string
}
