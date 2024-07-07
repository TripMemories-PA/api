import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexUserValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
    sortBy: vine.string().in(['score']).optional().requiredIfExists(['order']),
    order: vine.string().in(['asc', 'desc']).optional().requiredIfExists(['sortBy']),
  })
)
