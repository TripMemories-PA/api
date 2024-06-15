import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexPoiValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
    swLat: vine.number().optional().requiredIfAnyExists(['swLng', 'neLat', 'neLng']),
    swLng: vine.number().optional().requiredIfAnyExists(['swLat', 'neLat', 'neLng']),
    neLat: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLng']),
    neLng: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLat']),
  })
)
