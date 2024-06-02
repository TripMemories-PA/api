import UserService from '#services/user_service'
import { storeAvatarValidator } from '#validators/user/store_avatar_validator'
import { storeBannerValidator } from '#validators/user/store_banner_validator'
import { updateUserValidator } from '#validators/user/update_user_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MeController {
  constructor(protected userService: UserService) {}

  async show({ response, auth }: HttpContext) {
    const user = await this.userService.show(auth.user!.id)

    return response.ok(user.toJSON())
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator, {
      meta: { userId: auth.user!.id },
    })

    const user = await this.userService.update(auth.user!.id, payload)

    return response.ok(user.toJSON())
  }

  async storeAvatar({ request, response, auth }: HttpContext) {
    const { file } = await request.validateUsing(storeAvatarValidator)

    const uploadedFile = await this.userService.storeAvatar(auth.user!.id, file)

    return response.created(uploadedFile.toJSON())
  }

  async storeBanner({ request, response, auth }: HttpContext) {
    const { file } = await request.validateUsing(storeBannerValidator)

    const uploadedFile = await this.userService.storeBanner(auth.user!.id, file)

    return response.created(uploadedFile.toJSON())
  }

  async delete({ response, auth }: HttpContext) {
    await this.userService.delete(auth.user!.id)

    return response.noContent()
  }
}
