import { paginateRules } from '#validators/paginate_rules'
import vine from '@vinejs/vine'

export const indexPoiValidator = vine.compile(
  vine.object({
    ...paginateRules,
    search: vine.string().maxLength(32).optional(),
    sortBy: vine.string().in(['name']).optional().requiredIfExists(['order']),
    order: vine.string().in(['asc', 'desc']).optional().requiredIfExists(['sortBy']),
    lng: vine.number().optional().requiredIfExists(['lat', 'radius']),
    lat: vine.number().optional().requiredIfExists(['lng', 'radius']),
    radius: vine.number().optional().requiredIfExists(['lng', 'lat']),
    swLat: vine.number().optional().requiredIfAnyExists(['swLng', 'neLat', 'neLng']),
    swLng: vine.number().optional().requiredIfAnyExists(['swLat', 'neLat', 'neLng']),
    neLat: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLng']),
    neLng: vine.number().optional().requiredIfAnyExists(['swLat', 'swLng', 'neLat']),
  })
)
