import vine from '@vinejs/vine'

export const updateQuestValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
  })
)
