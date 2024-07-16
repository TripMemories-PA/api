import { PaginateRequest } from '../paginate_request.js'

export interface IndexUserRequest extends PaginateRequest {
  search?: string
  userTypeId?: number
  sortBy?: string
  order?: string
}
