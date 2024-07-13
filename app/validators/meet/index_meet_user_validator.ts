import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexMeetUserValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
