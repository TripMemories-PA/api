import UserService from '#services/user_service'
import { indexUserValidator } from '#validators/user/index_user_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserController {
  constructor(protected userService: UserService) {}

  async index({ response, auth, request }: HttpContext) {
    const payload = await request.validateUsing(indexUserValidator)

    const users = await this.userService.index(auth.user!, payload)

    return response.ok(users.toJSON())
  }

  async show({ response, params }: HttpContext) {
    const user = await this.userService.show(params.id)

    return response.ok(user.toJSON())
  }

  async indexFriends({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexUserValidator)

    const friends = await this.userService.indexFriends(params.id, payload)

    return response.ok(friends.toJSON())
  }
}
