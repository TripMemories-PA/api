import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class FriendRequestService {
  async store(user: User, receiverId: number) {
    const request = await user.related('sentFriendRequests').create({ receiverId })

    return request
  }

  async delete(user: User, requestId: number) {
    const request = await user
      .related('sentFriendRequests')
      .query()
      .where('id', requestId)
      .firstOrFail()

    await request.delete()
  }

  async accept(user: User, requestId: number) {
    const request = await user
      .related('receivedFriendRequests')
      .query()
      .where('id', requestId)
      .firstOrFail()

    await user.related('friends').attach([request.senderId])

    const sender = await User.findOrFail(request.senderId)
    await sender.related('friends').attach([user.id])

    await request.delete()
  }
}
