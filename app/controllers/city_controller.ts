import CityService from '#services/city_service'
import PoiService from '#services/poi_service'
import { indexCityValidator } from '#validators/city/index_city_validator'
import { indexPoiValidator } from '#validators/poi/index_poi_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CityController {
  constructor(
    protected cityService: CityService,
    protected poiService: PoiService
  ) {}

  async index({ response, request }: HttpContext) {
    const payload = await request.validateUsing(indexCityValidator)

    const cities = await this.cityService.index(payload)

    return response.ok(cities.toJSON())
  }

  async indexCityPois({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexPoiValidator)

    const pois = await this.poiService.index({
      ...payload,
      cityId: params.id,
    })

    return response.ok(pois.toJSON())
  }
}
