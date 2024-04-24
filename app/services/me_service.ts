import User from '#models/user'
import { UpdateMeRequest } from '../types/requests/me/update_me_request.js'

export default class MeService {
  async update(user: User, payload: UpdateMeRequest) {
    user.merge({
      username: payload.username,
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
    })

    const updated = await user.save()

    return updated
  }
}
