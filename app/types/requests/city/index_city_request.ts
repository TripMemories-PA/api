import { PaginateRequest } from '../paginate_request.js'

export interface IndexCityRequest extends PaginateRequest {
  search?: string
  sortBy?: string
  order?: string
}
