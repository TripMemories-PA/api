import { imageRules } from '#validators/image_rules'
import vine from '@vinejs/vine'

export const createPostImageValidator = vine.compile(
  vine.object({
    ...imageRules,
  })
)
