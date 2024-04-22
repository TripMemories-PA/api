import User from '#models/user'
import { LoginRequest } from '../types/requests/auth/login_request.js'
import { RegisterRequest } from '../types/requests/auth/register_request.js'

export default class AuthService {
  register(payload: RegisterRequest) {
    return User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    })
  }

  async login(payload: LoginRequest) {
    const user = await User.verifyCredentials(payload.login, payload.password)

    return await User.accessTokens.create(user, ['*'], { expiresIn: '1 hour' })
  }
}
