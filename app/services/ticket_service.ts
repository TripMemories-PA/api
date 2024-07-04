import Ticket from '#models/ticket'
import { inject } from '@adonisjs/core'
import { CreateTicketRequest } from '../types/requests/ticket/create_ticket_request.js'
import { UpdateTicketRequest } from '../types/requests/ticket/update_ticket_request.js'
import AuthService from './auth_service.js'

@inject()
export default class TicketService {
  constructor(private authService: AuthService) {}

  async create(payload: CreateTicketRequest) {
    return await Ticket.create({
      title: payload.title,
      description: payload.description,
      quantity: payload.quantity,
      price: payload.price * 100,
      groupSize: payload.groupSize,
      poiId: payload.poiId,
    })
  }

  async show(id: number) {
    return await Ticket.query().where('id', id).firstOrFail()
  }

  async indexPoiTickets(poiId: number) {
    return await Ticket.query().where('poiId', poiId).where('available', true).exec()
  }

  async delete(id: number) {
    const ticket = await Ticket.query().where('id', id).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (ticket.poiId !== user.poiId) {
      throw new Error('You are not authorized to delete this ticket')
    }

    ticket.available = false
    await ticket.save()
  }

  async update(id: number, payload: UpdateTicketRequest) {
    const ticket = await Ticket.query().where('id', id).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (ticket.poiId !== user.poiId) {
      throw new Error('You are not authorized to update this ticket')
    }

    ticket.merge({
      title: payload.title ?? ticket.title,
      description: payload.description ?? ticket.description,
      quantity: payload.quantity ?? ticket.quantity,
      price: payload.price ? payload.price * 100 : ticket.price,
      groupSize: payload.groupSize ?? ticket.groupSize,
    })

    return await ticket.save()
  }
}
