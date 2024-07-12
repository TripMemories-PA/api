import Meet from '#models/meet'
import Message from '#models/message'
import { Exception } from '@adonisjs/core/exceptions'
import PusherService from './pusher_service.js'
import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class MessageService {
  constructor(private pusherService: PusherService) {}

  async createMeetMessage(meetId: number, senderId: number, content: string) {
    const meet = await Meet.findOrFail(meetId)

    const canSendMessage = await meet
      .related('users')
      .query()
      .where('id', senderId)
      .where('is_banned', false)
      .first()

    if (!canSendMessage) {
      throw new Exception('You are not part of this meet', { status: 403 })
    }

    this.pusherService.sendMessage(meet.channel, 'message', content)

    return await Message.create({
      meetId,
      senderId,
      content,
    })
  }

  async createPrivateMessage(senderId: number, receiverId: number, content: string) {
    const receiver = await User.findOrFail(receiverId)

    const isFriend = await receiver.related('friends').query().where('friend_id', senderId).first()

    this.pusherService.sendMessage(isFriend.channel, 'message', content)

    return await Message.create({
      senderId,
      receiverId,
      content,
    })
  }
}
