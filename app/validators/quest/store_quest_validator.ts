import Poi from '#models/poi'
import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const storeQuestValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    imageId: vine.number().exists(async (_, value) => {
      const image = await UploadFile.query().where('id', value).first()

      return !!image
    }),
    poiId: vine.number().exists(async (_, value) => {
      const poi = await Poi.query().where('id', value).first()

      return !!poi
    }),
    label: vine.string().maxLength(50),
  })
)
