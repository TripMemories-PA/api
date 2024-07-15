import Meet from '#models/meet'
import { DateTime } from 'luxon'
import { CreateMeetRequest } from '../types/requests/meet/create_meet_request.js'
import { PaginateRequest } from '../types/requests/paginate_request.js'
import { UpdateMeetRequest } from '../types/requests/meet/update_meet_request.js'
import { Exception } from '@adonisjs/core/exceptions'
import dayjs from 'dayjs'
import AuthService from './auth_service.js'
import { inject } from '@adonisjs/core'
import StripeService from './stripe_service.js'
import Ticket from '#models/ticket'
import UserTicket from '#models/user_ticket'
import { randomUUID } from 'node:crypto'

@inject()
export default class MeetService {
  constructor(
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

  async create(payload: CreateMeetRequest) {
    let ticket = null

    if (payload.ticketId) {
      ticket = await Ticket.query().where('id', payload.ticketId).firstOrFail()
    }

    const meet = await Meet.create({
      title: payload.title,
      description: payload.description,
      size: ticket ? ticket.groupSize : payload.size,
      date: DateTime.fromJSDate(payload.date),
      poiId: payload.poiId,
      ticketId: payload.ticketId,
      createdById: payload.createdById,
      price: ticket ? ticket.price : null,
      channel: randomUUID(),
    })

    await meet.related('users').attach([payload.createdById])

    if (ticket) {
      ticket.quantity -= 1
      await ticket.save()
    }

    return meet
  }

  async show(id: number) {
    return await Meet.query().where('id', id).firstOrFail()
  }

  async indexPoiMeets(poiId: number, payload: PaginateRequest) {
    return await Meet.query()
      .where('poiId', poiId)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .orderBy('date', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async indexUserMeets(userId: number, payload: PaginateRequest) {
    return await Meet.query()
      .whereHas('users', (builder) => {
        builder.where('user_id', userId).where('is_banned', false)
      })
      .orderBy('date', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async indexUsers(id: number, payload: PaginateRequest) {
    const meet = await Meet.query().where('id', id).firstOrFail()

    return await meet
      .related('users')
      .query()
      .where('is_banned', false)
      .paginate(payload.page, payload.perPage)
  }

  async deleteUser(id: number, userId: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (meet.createdById !== user.id) {
      throw new Exception('Unauthorized', { status: 401 })
    }

    if (meet.createdById === userId) {
      throw new Exception('Cannot delete creator', { status: 400 })
    }

    const hasJoined = await meet.related('users').query().where('user_id', userId).first()

    if (!hasJoined) {
      throw new Exception('User has not joined meet', { status: 400 })
    }

    if (meet.isLocked) {
      throw new Exception('Cannot delete user from locked meet', { status: 400 })
    }

    const hasPaid = await meet
      .related('users')
      .query()
      .where('user_id', userId)
      .where('has_paid', true)
      .first()

    if (hasPaid) {
      const userTicket = await UserTicket.query()
        .where('meetId', meet.id)
        .where('userId', userId)
        .firstOrFail()

      await this.stripeService.refundPayment(userTicket.piId)
      await meet.related('users').query().where('user_id', userId).update({ has_paid: false })
    }

    await meet.related('users').query().where('user_id', userId).update({ is_banned: true })
  }

  async update(id: number, payload: UpdateMeetRequest) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (meet.createdById !== user.id) {
      throw new Exception('Unauthorized', { status: 401 })
    }

    if (meet.isLocked) {
      throw new Exception('Cannot update locked meet', { status: 400 })
    }

    meet.merge({
      title: payload.title ?? meet.title,
      description: payload.description ?? meet.description,
    })

    await meet.save()

    return meet
  }

  async delete(id: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (meet.createdById !== user.id) {
      throw new Exception('Unauthorized', { status: 401 })
    }

    if (meet.isLocked) {
      throw new Exception('Cannot delete locked meet', { status: 400 })
    }

    if (meet.ticketId) {
      const hasPaidUsers = await meet.related('users').query().where('has_paid', true).exec()

      for (const hasPaidUser of hasPaidUsers) {
        const userTicket = await UserTicket.query()
          .where('meetId', meet.id)
          .where('userId', hasPaidUser.id)
          .firstOrFail()

        await this.stripeService.refundPayment(userTicket.piId)
      }

      const ticket = await Ticket.query().where('id', meet.ticketId).firstOrFail()
      ticket.quantity += 1
      await ticket.save()
    }

    await meet.delete()
  }

  async join(id: number, userId: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    if (!meet.canJoin) {
      throw new Exception('Cannot join meet', { status: 400 })
    }

    await meet.related('users').attach([userId])
  }

  async leave(id: number, userId: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    const hasJoined = await meet
      .related('users')
      .query()
      .where('user_id', userId)
      .where('is_banned', false)
      .first()

    if (meet.createdById === userId || !hasJoined) {
      throw new Exception('Cannot leave meet', { status: 400 })
    }

    if (meet.isLocked) {
      throw new Exception('Cannot leave locked meet', { status: 400 })
    }

    const hasPaid = await meet
      .related('users')
      .query()
      .where('user_id', userId)
      .where('has_paid', true)
      .first()

    if (hasPaid) {
      const userTicket = await UserTicket.query()
        .where('meetId', meet.id)
        .where('userId', userId)
        .firstOrFail()

      await this.stripeService.refundPayment(userTicket.piId)
    }

    await meet.related('users').detach([userId])
  }

  async pay(id: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    const hasJoined = await meet
      .related('users')
      .query()
      .where('user_id', user.id)
      .where('is_banned', false)
      .first()

    if (!hasJoined || hasJoined.hasPaid || !meet.ticketId || meet.isLocked) {
      throw new Exception('Cannot pay for meet', { status: 400 })
    }

    const price = Math.floor(meet.price! / meet.size)

    const customerId = await this.stripeService.getCustomerId(user.id)
    const paymentIntent = await this.stripeService.createPaymentIntent(price, customerId, meet.id)

    await UserTicket.query().where('userId', user.id).where('meetId', meet.id).delete()

    await UserTicket.create({
      piId: paymentIntent.id,
      qrCode: randomUUID(),
      ticketId: meet.ticketId,
      userId: user.id,
      meetId: meet.id,
      price,
    })

    return paymentIntent
  }
}
