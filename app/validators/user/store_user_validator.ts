import Poi from '#models/poi'
import User from '#models/user'
import vine from '@vinejs/vine'

export const storeUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (_, value) => {
        const user = await User.query().where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(32)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
    poiId: vine.number().exists(async (_, value) => {
      const poi = await Poi.query().where('id', value).first()

      if (!poi) {
        return false
      }

      const user = await User.query().where('poiId', value).first()

      return !user
    }),
  })
)
