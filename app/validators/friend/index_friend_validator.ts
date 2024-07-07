import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexFriendValidator = vine.compile(
  vine.object({
    ...paginateRules,
    swLat: vine.number().optional().requiredIfAnyExists(['swLng', 'neLat', 'neLng']),
    swLng: vine.number().optional().requiredIfAnyExists(['swLat', 'neLat', 'neLng']),
    neLat: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLng']),
    neLng: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLat']),
  })
)
