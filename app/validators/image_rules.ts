import vine from '@vinejs/vine'

export const imageRules = {
  file: vine.file({
    size: '10mb',
    extnames: ['jpg', 'jpeg', 'png'],
  }),
}
