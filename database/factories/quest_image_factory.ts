import UploadFile from '#models/upload_file'
import factory from '@adonisjs/lucid/factories'

export const QuestImageFactory = factory
  .define(UploadFile, async ({ faker }) => {
    return {
      filename: faker.system.commonFileName('jpg'),
      url: faker.image.urlPicsumPhotos(),
      mimeType: 'image/jpeg',
    }
  })
  .build()
