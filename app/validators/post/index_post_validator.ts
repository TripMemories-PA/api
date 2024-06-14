import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexPostValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
