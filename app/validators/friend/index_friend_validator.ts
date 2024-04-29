import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexFriendValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
