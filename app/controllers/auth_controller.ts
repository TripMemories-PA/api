import AuthService from '#services/auth_service'
import { loginValidator } from '#validators/auth/login_validator'
import { registerValidator } from '#validators/auth/register_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await this.authService.register(payload)

    return response.created(user.toJSON())
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const token = await this.authService.login(payload)

    return response.ok({
      type: 'bearer',
      token: token.value?.release(),
      expiresAt: token.expiresAt,
    })
  }
}
