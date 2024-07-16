import UserType from '#models/user_type'
import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexUserValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
    userTypeId: vine
      .number()
      .exists(async (_, value) => {
        const type = await UserType.query().where('id', value).first()

        return !!type
      })
      .optional(),
    sortBy: vine.string().in(['score']).optional().requiredIfExists(['order']),
    order: vine.string().in(['asc', 'desc']).optional().requiredIfExists(['sortBy']),
  })
)
