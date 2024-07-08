import Poi from '#models/poi'
import Ticket from '#models/ticket'
import vine from '@vinejs/vine'
import dayjs from 'dayjs'

export const storeMeetValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(50),
    description: vine.string().maxLength(255),
    size: vine.number().min(2).max(50),
    date: vine
      .date({
        formats: ['YYYY-MM-DD HH:mm:ss'],
      })
      .afterOrEqual((field) => {
        if (!field.parent.ticketId) {
          return dayjs().format('YYYY-MM-DD')
        }

        return dayjs().add(1, 'week').format('YYYY-MM-DD')
      }),
    poiId: vine.number().exists(async (_, value) => {
      const poi = await Poi.query().where('id', value).first()

      return !!poi
    }),
    ticketId: vine
      .number()
      .exists(async (_, value) => {
        if (!value) {
          return true
        }

        const ticket = await Ticket.query().where('id', value).first()

        return !!ticket
      })
      .nullable(),
  })
)
