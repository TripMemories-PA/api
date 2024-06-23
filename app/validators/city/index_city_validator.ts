import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexCityValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
    sortBy: vine.string().in(['name']).optional().requiredIfExists(['order']),
    order: vine.string().in(['asc', 'desc']).optional().requiredIfExists(['sortBy']),
  })
)
