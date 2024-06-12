import factory from '@adonisjs/lucid/factories'
import UploadFile from '#models/upload_file'

export const PostImageFactory = factory
  .define(UploadFile, async ({ faker }) => {
    return {
      filename: faker.system.commonFileName('jpg'),
      url: faker.image.urlPicsumPhotos(),
      mimeType: 'image/jpeg',
    }
  })
  .build()
