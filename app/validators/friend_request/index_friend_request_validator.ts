import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexFriendRequestValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
