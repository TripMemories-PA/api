import { PaginateRequest } from '../paginate_request.js'

export interface IndexPoiRequest extends PaginateRequest {
  search?: string
  swLat?: number
  swLng?: number
  neLat?: number
  neLng?: number
}
