import Poi from '#models/poi'
import { IndexPoiRequest } from '../types/requests/poi/index_poi_request.js'

export default class PoiService {
  async index(payload: IndexPoiRequest) {
    const query = Poi.query()

    if (payload.search) {
      query.where((builder) => {
        builder
          .where('name', 'ilike', `%${payload.search}%`)
          .orWhere('city', 'ilike', `%${payload.search}%`)
      })
    }

    return await query.paginate(payload.page, payload.perPage)
  }
}
