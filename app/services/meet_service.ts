import Meet from '#models/meet'
import { DateTime } from 'luxon'
import { CreateMeetRequest } from '../types/requests/meet/create_meet_request.js'
import { PaginateRequest } from '../types/requests/paginate_request.js'
import { UpdateMeetRequest } from '../types/requests/meet/update_meet_request.js'
import { Exception } from '@adonisjs/core/exceptions'
import dayjs from 'dayjs'
import AuthService from './auth_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class MeetService {
  constructor(private authService: AuthService) {}

  async create(payload: CreateMeetRequest) {
    const meet = await Meet.create({
      title: payload.title,
      description: payload.description,
      size: payload.size,
      date: DateTime.fromJSDate(payload.date),
      poiId: payload.poiId,
      ticketId: payload.ticketId,
      createdById: payload.createdById,
    })

    const user = this.authService.getAuthenticatedUser()

    await meet.related('users').attach([user.id])

    return meet
  }

  async show(id: number) {
    return await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()
  }

  async indexPoiMeets(poiId: number, payload: PaginateRequest) {
    return await Meet.query()
      .where('poiId', poiId)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .orderBy('date', 'asc')
      .paginate(payload.page, payload.perPage)
  }

  async indexUsers(id: number, payload: PaginateRequest) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .firstOrFail()

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

    await meet.related('users').query().where('user_id', userId).update({ isBanned: true })
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

    await meet.delete()
  }

  async join(id: number, userId: number) {
    const meet = await Meet.query()
      .where('id', id)
      .where('date', '>', dayjs().format('YYYY-MM-DD HH:mm:ss'))
      .preload('users')
      .firstOrFail()

    if (meet.users.length >= meet.size) {
      throw new Exception('Meet is full', { status: 400 })
    }

    //if already joined
    if (meet.users.find((user) => user.id === userId)) {
      throw new Exception('Already joined meet', { status: 400 })
    }

    await meet.related('users').attach([userId])
  }

  async leave(id: number, userId: number) {
    const meet = await Meet.query().where('id', id).firstOrFail()

    const hasJoined = await meet.related('users').query().where('user_id', userId).first()

    if (meet.createdById === userId || !hasJoined) {
      throw new Exception('Cannot leave meet', { status: 400 })
    }

    await meet.related('users').detach([userId])
  }
}
