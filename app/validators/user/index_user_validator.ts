import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexUserValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
  })
)
