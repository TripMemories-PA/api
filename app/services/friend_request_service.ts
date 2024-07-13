import User from '#models/user'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'
import { UserTypes } from '../types/models/user_types.js'
import { randomUUID } from 'node:crypto'

@inject()
export default class FriendRequestService {
  async store(userId: number, receiverId: number) {
    const user = await User.query()
      .where('id', userId)
      .where('userTypeId', UserTypes.USER)
      .firstOrFail()

    return await user.related('sentFriendRequests').create({ receiverId })
  }

  async delete(userId: number, requestId: number) {
    const user = await User.findOrFail(userId)

    const request = await user
      .related('receivedFriendRequests')
      .query()
      .where('id', requestId)
      .firstOrFail()

    await request.delete()
  }

  async accept(userId: number, requestId: number) {
    const user = await User.findOrFail(userId)

    const request = await user
      .related('receivedFriendRequests')
      .query()
      .where('id', requestId)
      .firstOrFail()

    const sender = await User.findOrFail(request.senderId)

    const channel = randomUUID()

    await user.related('friends').attach({
      [request.senderId]: {
        channel,
      },
    })
    await sender.related('friends').attach({
      [userId]: {
        channel,
      },
    })

    await request.delete()
  }

  async index(userId: number, request: PaginateRequest) {
    const user = await User.query()
      .where('id', userId)
      .where('userTypeId', UserTypes.USER)
      .firstOrFail()

    return await user
      .related('receivedFriendRequests')
      .query()
      .paginate(request.page, request.perPage)
  }
}
