import Ticket from '#models/ticket'
import { inject } from '@adonisjs/core'
import { CreateTicketRequest } from '../types/requests/ticket/create_ticket_request.js'
import { UpdateTicketRequest } from '../types/requests/ticket/update_ticket_request.js'
import AuthService from './auth_service.js'
import StripeService from './stripe_service.js'
import UserTicket from '#models/user_ticket'
import { randomUUID } from 'node:crypto'
import { BuyTicketRequest } from '../types/requests/ticket/buy_ticket_request.js'
import { DateTime } from 'luxon'
import Meet from '#models/meet'

@inject()
export default class TicketService {
  constructor(
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

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
    return await Ticket.query().where('id', id).where('available', true).firstOrFail()
  }

  async indexPoiTickets(poiId: number) {
    return await Ticket.query().where('poiId', poiId).where('available', true).exec()
  }

  async delete(id: number) {
    const ticket = await Ticket.query().where('id', id).where('available', true).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (ticket.poiId !== user.poiId) {
      throw new Error('You are not authorized to delete this ticket')
    }

    ticket.available = false
    await ticket.save()
  }

  async update(id: number, payload: UpdateTicketRequest) {
    const ticket = await Ticket.query().where('id', id).where('available', true).firstOrFail()

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

  async buy(userId: number, buyTickets: BuyTicketRequest[]) {
    const tickets = await Ticket.query()
      .whereIn(
        'id',
        buyTickets.map((ticket) => ticket.id)
      )
      .where('available', true)
      .exec()

    const totalPrice = tickets.reduce((acc, ticket) => {
      const buyTicket = buyTickets.find((element) => element.id === ticket.id)
      return acc + ticket.price * buyTicket!.quantity
    }, 0)

    const customerId = await this.stripeService.getCustomerId(userId)
    const paymentIntent = await this.stripeService.createPaymentIntent(totalPrice, customerId)

    buyTickets.forEach(async (buyTicket) => {
      await UserTicket.createMany(
        Array.from({ length: buyTicket.quantity }).map(() => ({
          piId: paymentIntent.id,
          qrCode: randomUUID(),
          ticketId: buyTicket.id,
          userId,
          price: tickets.find((ticket) => ticket.id === buyTicket.id)!.price,
        }))
      )
    })

    return paymentIntent
  }

  async webhook(payload: any) {
    if (payload.type === 'payment_intent.succeeded') {
      const paymentIntent = payload.data.object
      const metadata = paymentIntent.metadata

      if (metadata.meetId) {
        const meet = await Meet.query().where('id', metadata.meetId).firstOrFail()
        const userTicket = await UserTicket.query().where('piId', paymentIntent.id).firstOrFail()

        await meet
          .related('users')
          .query()
          .where('user_id', userTicket.userId)
          .update({ has_paid: true })

        const users = await meet
          .related('users')
          .query()
          .where('has_paid', true)
          .where('is_banned', false)
          .exec()

        if (users.length === meet.size) {
          await UserTicket.query()
            .where('meetId', meet.id)
            .update({ paid: true, paidAt: DateTime.now() })
        }
      } else {
        const userTickets = await UserTicket.query().where('piId', paymentIntent.id).exec()

        for (const userTicket of userTickets) {
          userTicket.paid = true
          userTicket.paidAt = DateTime.now()
          await userTicket.save()

          const ticket = await Ticket.query().where('id', userTicket.ticketId).firstOrFail()
          ticket.quantity = Math.max(0, ticket.quantity - 1)
          await ticket.save()
        }
      }
    }
  }

  async indexUserTickets(userId: number) {
    return await UserTicket.query().where('userId', userId).where('paid', true).exec()
  }

  async validate(qrCode: string, poiId: number) {
    const ticket = await UserTicket.query()
      .where('qrCode', qrCode)
      .where('paid', true)
      .preload('ticket')
      .firstOrFail()

    if (ticket.ticket.poiId !== poiId) {
      return { valid: false, ticket }
    }

    if (ticket.usedAt) {
      return { valid: false, ticket }
    }

    ticket.usedAt = DateTime.now()
    await ticket.save()

    return { valid: true, ticket }
  }

  async indexSales(poiId: number) {
    const sales = await UserTicket.query()
      .whereHas('ticket', (query) => {
        query.where('poiId', poiId)
      })
      .where('paid', true)
      .orderBy('paidAt', 'asc')
      .exec()

    let salesByDate: { [key: string]: { tickets: number; revenue: number } } = {}

    // format sales by date of month
    for (const sale of sales) {
      const date: string = sale.paidAt!.toFormat('MM/yyyy')

      if (salesByDate[date]) {
        salesByDate[date].tickets += sale.ticket.groupSize
        salesByDate[date].revenue += sale.price / 100
      } else {
        salesByDate[date] = {
          tickets: sale.ticket.groupSize,
          revenue: sale.price / 100,
        }
      }
    }

    return salesByDate
  }
}
