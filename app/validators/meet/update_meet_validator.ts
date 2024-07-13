import vine from '@vinejs/vine'

export const updateMeetValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(50).optional(),
    description: vine.string().maxLength(255).optional(),
  })
)
