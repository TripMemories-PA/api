import { imageRules } from '#validators/image_rules'
import vine from '@vinejs/vine'

export const storeAvatarValidator = vine.compile(
  vine.object({
    ...imageRules,
  })
)
