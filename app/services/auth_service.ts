import User from '#models/user'
import { RegisterRequest } from '../types/register_request.js'

export default class AuthService {
  register(payload: RegisterRequest) {
    return User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    })
  }
}
