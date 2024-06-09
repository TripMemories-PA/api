import PoiService from '#services/poi_service'
import { indexPoiValidator } from '#validators/poi/index_poi_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PoiController {
  constructor(protected poiService: PoiService) {}

  async index({ response, request }: HttpContext) {
    const payload = await request.validateUsing(indexPoiValidator)

    const pois = await this.poiService.index(payload)

    return response.ok(pois.toJSON())
  }
}
