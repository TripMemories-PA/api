import AuthService from '#services/auth_service'
import { registerValidator } from '#validators/auth/register_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await this.authService.register(payload)

    return response.created(user)
  }
}
