import Poi from '#models/poi'
import db from '@adonisjs/lucid/services/db'
import { IndexPoiRequest } from '../types/requests/poi/index_poi_request.js'

export default class PoiService {
  async index(payload: IndexPoiRequest) {
    const query = Poi.query()

    if (payload.cityId) {
      query.where('cityId', payload.cityId)
    }

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

    if (payload.lat && payload.lng && payload.radius) {
      query
        .select(
          db.raw(
            '*, ST_Distance(ST_Point(?, ?), ST_Point(longitude, latitude)) / 1000 as distance',
            [payload.lng, payload.lat]
          )
        )
        .whereRaw(
          'ST_DWithin(ST_Point(longitude, latitude)::geography, ST_Point(?, ?)::geography, ?)',
          [payload.lng, payload.lat, payload.radius * 1000]
        )
        .orderBy('distance', 'asc')
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
