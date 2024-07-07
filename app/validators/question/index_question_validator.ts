import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexQuestionValidator = vine.compile(
  vine.object({
    ...paginateRules,
  })
)
