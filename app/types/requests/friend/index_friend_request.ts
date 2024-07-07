import { PaginateRequest } from '../paginate_request.js'

export interface IndexFriendRequest extends PaginateRequest {
  swLat?: number
  swLng?: number
  neLat?: number
  neLng?: number
}
