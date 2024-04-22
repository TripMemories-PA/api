import MeService from '#services/me_service'
import { updateMeValidator } from '#validators/me/update_me_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MeController {
  constructor(protected meService: MeService) {}

  async show({ response, auth }: HttpContext) {
    return response.ok(auth.user)
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateMeValidator, {
      meta: { userId: auth.user!.id },
    })

    const user = await this.meService.update(auth.user!, payload)

    return response.ok(user)
  }
}
