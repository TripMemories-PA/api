import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { LoginRequest } from '../types/requests/auth/login_request.js'
import { RegisterRequest } from '../types/requests/auth/register_request.js'
import { UserTypes } from '../types/models/user_types.js'

export default class AuthService {
  async register(payload: RegisterRequest) {
    return await User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      firstname: payload.firstname,
      lastname: payload.lastname,
      userTypeId: UserTypes.USER,
    })
  }

  async login(payload: LoginRequest) {
    const user = await User.verifyCredentials(payload.login, payload.password)

    return await User.accessTokens.create(user, ['*'], { expiresIn: '7 day' })
  }

  getAuthenticatedUser() {
    const context = HttpContext.getOrFail()

    if (!context.auth.user) {
      throw new Error('User not authenticated')
    }

    return context.auth.user
  }

  async refresh(userId: number) {
    const user = await User.findOrFail(userId)

    return await User.accessTokens.create(user, ['*'], { expiresIn: '7 day' })
  }
}
