import MeService from '#services/me_service'
import { storeAvatarValidator } from '#validators/me/store_avatar_validator'
import { storeBannerValidator } from '#validators/me/store_banner_validator'
import { updateMeValidator } from '#validators/me/update_me_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MeController {
  constructor(protected meService: MeService) {}

  async show({ response, auth }: HttpContext) {
    const user = await this.meService.get(auth.user!)

    return response.ok(user.toJSON())
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateMeValidator, {
      meta: { userId: auth.user!.id },
    })

    const user = await this.meService.update(auth.user!, payload)

    return response.ok(user.toJSON())
  }

  async storeAvatar({ request, response, auth }: HttpContext) {
    const { file } = await request.validateUsing(storeAvatarValidator)

    const uploadedFile = await this.meService.storeAvatar(auth.user!, file)

    return response.created(uploadedFile.toJSON())
  }

  async storeBanner({ request, response, auth }: HttpContext) {
    const { file } = await request.validateUsing(storeBannerValidator)

    const uploadedFile = await this.meService.storeBanner(auth.user!, file)

    return response.created(uploadedFile.toJSON())
  }

  async delete({ response, auth }: HttpContext) {
    await this.meService.delete(auth.user!)

    return response.noContent()
  }
}
