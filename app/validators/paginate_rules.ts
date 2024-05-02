import vine from '@vinejs/vine'

export const paginateRules = {
  page: vine.number().positive(),
  perPage: vine.number().positive(),
}
