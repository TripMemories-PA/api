import User from '#models/user'

export default class AuthService {
  register(payload: { email: string; password: string }) {
    return User.create(payload)
  }
}
