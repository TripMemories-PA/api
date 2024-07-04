import Ticket from '#models/ticket'
import { CreateTicketRequest } from '../types/requests/ticket/create_ticket_request.js'

export default class TicketService {
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
}
