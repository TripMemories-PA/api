import vine from '@vinejs/vine'

export const validateTicketValidator = vine.compile(
  vine.object({
    qrCode: vine.string().maxLength(50),
  })
)
