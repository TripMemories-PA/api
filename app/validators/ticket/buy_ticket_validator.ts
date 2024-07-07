import Ticket from '#models/ticket'
import vine from '@vinejs/vine'

export const buyTicketValidator = vine.compile(
  vine.object({
    tickets: vine
      .array(
        vine.object({
          id: vine.number().exists(async (_, value) => {
            const ticket = await Ticket.query().where('id', value).where('available', true).first()

            return !!ticket
          }),
          quantity: vine
            .number()
            .min(1)
            .exists(async (_, value, field) => {
              const ticket = await Ticket.query().where('id', field.parent.id).first()

              if (!ticket) {
                return false
              }

              return ticket.quantity >= Number(value)
            }),
        })
      )
      .distinct('id')
      .minLength(1),
  })
)
