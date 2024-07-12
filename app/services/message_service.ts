import Meet from '#models/meet'
import Message from '#models/message'
import { Exception } from '@adonisjs/core/exceptions'
import PusherService from './pusher_service.js'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import AuthService from './auth_service.js'
import { PaginateRequest } from '../types/requests/paginate_request.js'

@inject()
export default class MessageService {
  constructor(
    private pusherService: PusherService,
    private authService: AuthService
  ) {}

  async createMeetMessage(meetId: number, senderId: number, content: string) {
    const meet = await Meet.findOrFail(meetId)

    const canSendMessage = await meet
      .related('users')
      .query()
      .where('user_id', senderId)
      .where('is_banned', false)
      .first()

    if (!canSendMessage) {
      throw new Exception('You are not part of this meet', { status: 403 })
    }

    const message = await Message.create({
      meetId,
      senderId,
      content,
    })

    this.pusherService.sendMessage(meet.channel, 'message', message.id)

    return message
  }

  async indexMeetMessages(meetId: number, payload: PaginateRequest) {
    const meet = await Meet.findOrFail(meetId)
    const user = this.authService.getAuthenticatedUser()

    const canViewMessages = await meet
      .related('users')
      .query()
      .where('user_id', user.id)
      .where('is_banned', false)
      .first()

    if (!canViewMessages) {
      throw new Exception('You are not part of this meet', { status: 403 })
    }

    return await meet
      .related('messages')
      .query()
      .orderBy('createdAt', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async createPrivateMessage(senderId: number, receiverId: number, content: string) {
    const receiver = await User.findOrFail(receiverId)

    const isFriend = await receiver.related('friends').query().where('friend_id', senderId).first()

    if (!isFriend) {
      throw new Exception('You are not friends with this user', { status: 403 })
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
    })

    this.pusherService.sendMessage(receiver.channel!, 'message', message.id)

    return message
  }

  async indexPrivateMessages(receiverId: number, payload: PaginateRequest) {
    const user = this.authService.getAuthenticatedUser()

    const isFriend = await user.related('friends').query().where('friend_id', receiverId).first()

    if (!isFriend) {
      throw new Exception('You are not friends with this user', { status: 403 })
    }

    return await Message.query()
      .where('sender_id', user.id)
      .where('receiver_id', receiverId)
      .orWhere('sender_id', receiverId)
      .where('receiver_id', user.id)
      .orderBy('createdAt', 'desc')
      .paginate(payload.page, payload.perPage)
  }
}
