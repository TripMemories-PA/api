import { imageRules } from '#validators/image_rules'
import vine from '@vinejs/vine'

export const storeBannerValidator = vine.compile(
  vine.object({
    ...imageRules,
  })
)
