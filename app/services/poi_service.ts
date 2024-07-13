import Poi from '#models/poi'
import db from '@adonisjs/lucid/services/db'
import { IndexPoiRequest } from '../types/requests/poi/index_poi_request.js'
import { CreatePoiRequest } from '../types/requests/poi/create_poi_request.js'
import PoiType from '#models/poi_type'
import { UpdatePoiRequest } from '../types/requests/poi/update_poi_request.js'

export default class PoiService {
  async index(payload: IndexPoiRequest) {
    const query = Poi.query()

    if (payload.cityId) {
      query.where('cityId', payload.cityId)
    }

    if (payload.search) {
      query.where((builder) => {
        builder.where('name', 'ilike', `%${payload.search}%`).orWhereHas('city', (city) => {
          city.where('name', 'ilike', `%${payload.search}%`)
        })
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

  async create(payload: CreatePoiRequest) {
    return await Poi.create({
      name: payload.name,
      description: payload.description,
      coverId: payload.coverId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      cityId: payload.cityId,
      address: payload.address,
      typeId: payload.typeId,
    })
  }

  async update(id: number, payload: UpdatePoiRequest) {
    const poi = await Poi.findOrFail(id)

    poi.merge({
      name: payload.name ?? poi.name,
      description: payload.description ?? poi.description,
      coverId: payload.coverId ?? poi.coverId,
    })

    await poi.save()

    return poi
  }

  async indexTypes() {
    return await PoiType.all()
  }
}
