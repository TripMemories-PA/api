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

    if (payload.swLat && payload.swLng && payload.neLat && payload.neLng) {
      query
        .whereBetween('latitude', [payload.swLat, payload.neLat])
        .whereBetween('longitude', [payload.swLng, payload.neLng])
    }

    if (payload.sortBy && payload.order) {
      const order = payload.order === 'asc' ? 'asc' : 'desc'
      query.orderByRaw(`${payload.sortBy} COLLATE UNICODE ${order}`)
    }

    return await query.paginate(payload.page, payload.perPage)
  }

  async show(id: number) {
    return await Poi.query().where('id', id).firstOrFail()
  }
}
