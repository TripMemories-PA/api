import Poi from '#models/poi'
import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(40),
    content: vine.string().maxLength(500),
    imageId: vine.number().exists(async (_, value) => {
      const image = await UploadFile.query().where('id', value).first()

      return !!image
    }),
    poiId: vine.number().exists(async (_, value) => {
      const poi = await Poi.query().where('id', value).first()

      return !!poi
    }),
    note: vine.number().min(0).max(5).decimal([0, 1]),
  })
)
