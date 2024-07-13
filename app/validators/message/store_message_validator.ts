import vine from '@vinejs/vine'

export const storeMessageValidator = vine.compile(
  vine.object({
    content: vine.string().maxLength(255),
  })
)
