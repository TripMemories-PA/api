import vine from '@vinejs/vine'

export const storeFileValidator = vine.compile(
  vine.object({
    file: vine.file({
      size: '4mb',
      extnames: ['jpg', 'jpeg', 'png', 'pdf'],
    }),
  })
)
