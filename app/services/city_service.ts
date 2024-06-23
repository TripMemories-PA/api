import City from '#models/city'
import { IndexCityRequest } from '../types/requests/city/index_city_request.js'

export default class CityService {
  async index(payload: IndexCityRequest) {
    const query = City.query()
    if (payload.search) {
      query.where('name', 'ilike', `%${payload.search}%`)
    }

    if (payload.sortBy && payload.order) {
      const order = payload.order === 'asc' ? 'asc' : 'desc'
      query.orderBy(payload.sortBy, order)
    }

    return await query.paginate(payload.page, payload.perPage)
  }
}
