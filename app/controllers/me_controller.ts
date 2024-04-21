import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MeController {
  async me({ response, auth }: HttpContext) {
    return response.ok(auth.user)
  }
}
