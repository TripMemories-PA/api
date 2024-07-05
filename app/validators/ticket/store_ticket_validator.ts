import vine from '@vinejs/vine'

export const storeTicketValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(50),
    description: vine.string().maxLength(500).nullable(),
    quantity: vine.number().min(1),
    price: vine.number().min(1).decimal([0, 2]),
    groupSize: vine.number().min(1),
  })
)
