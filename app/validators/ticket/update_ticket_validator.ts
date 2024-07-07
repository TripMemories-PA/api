import vine from '@vinejs/vine'

export const updateTicketValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(50).optional(),
    description: vine.string().maxLength(500).nullable().optional(),
    quantity: vine.number().min(1).optional(),
    price: vine.number().min(1).decimal([0, 2]).optional(),
    groupSize: vine.number().min(1).optional(),
  })
)
