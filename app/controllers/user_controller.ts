// import type { HttpContext } from '@adonisjs/core/http'

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
}
