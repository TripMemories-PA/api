import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(32)
      .regex(/^\w+$/)
      .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(32)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
      .confirmed(),
  })
)
