import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class FriendRequestService {
  async store(user: User, receiverId: number) {
    const request = await user.related('sentFriendRequests').create({ receiverId })

    return request
  }
}
