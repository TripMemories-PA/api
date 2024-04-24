import vine from '@vinejs/vine'

export const storeAvatarValidator = vine.compile(
  vine.object({
    file: vine.file({
      size: '4mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)
