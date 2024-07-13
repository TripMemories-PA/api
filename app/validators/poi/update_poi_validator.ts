import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const updatePoiValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50).optional(),
    description: vine.string().maxLength(500).optional(),
    coverId: vine
      .number()
      .exists(async (_, value) => {
        const image = await UploadFile.query().where('id', value).first()

        return !!image
      })
      .optional(),
  })
)
