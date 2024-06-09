import { PaginateRequest } from '../paginate_request.js'

export interface IndexPoiRequest extends PaginateRequest {
  search?: string
}
