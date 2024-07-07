import { imageRules } from '#validators/image_rules'
import vine from '@vinejs/vine'

export const storeQuestionImageValidator = vine.compile(
  vine.object({
    ...imageRules,
  })
)
