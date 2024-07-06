import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const updateQuestionValidator = vine.compile(
  vine.object({
    question: vine.string().maxLength(255).optional(),
    imageId: vine
      .number()
      .exists(async (_, value) => {
        const image = await UploadFile.query().where('id', value).first()

        return !!image
      })
      .nullable()
      .optional(),
    answers: vine
      .array(
        vine.object({
          answer: vine.string().maxLength(255),
          isCorrect: vine.boolean(),
        })
      )
      .minLength(2)
      .maxLength(4)
      .optional(),
  })
)
