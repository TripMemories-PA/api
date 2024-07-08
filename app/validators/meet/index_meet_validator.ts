import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexMeetValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
