import vine from '@vinejs/vine'

export const imageRules = {
  file: vine.file({
    size: '4mb',
    extnames: ['jpg', 'jpeg', 'png'],
  }),
}
