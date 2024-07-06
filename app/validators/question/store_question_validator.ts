import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const storeQuestionValidator = vine.compile(
  vine.object({
    question: vine.string().maxLength(255),
    imageId: vine
      .number()
      .exists(async (_, value) => {
        const image = await UploadFile.query().where('id', value).first()

        return !!image
      })
      .nullable(),
    answers: vine
      .array(
        vine.object({
          answer: vine.string().maxLength(255),
          isCorrect: vine.boolean(),
        })
      )
      .minLength(2)
      .maxLength(4),
  })
)
