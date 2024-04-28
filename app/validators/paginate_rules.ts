import vine from '@vinejs/vine'

export const paginateRules = {
  page: vine.number().positive().optional(),
  perPage: vine.number().positive().optional().requiredIfExists('page'),
}
