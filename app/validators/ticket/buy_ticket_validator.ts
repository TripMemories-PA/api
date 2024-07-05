import Ticket from '#models/ticket'
import vine from '@vinejs/vine'

export const buyTicketValidator = vine.compile(
  vine.object({
    ticketIds: vine.array(
      vine.number().exists(async (_, value) => {
        const ticket = await Ticket.query().where('id', value).where('available', true).first()

        return !!ticket
      })
    ),
  })
)
