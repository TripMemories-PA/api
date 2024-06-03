import factory from '@adonisjs/lucid/factories'
import UploadFile from '#models/upload_file'

export const AvatarFactory = factory
  .define(UploadFile, async ({ faker }) => {
    return {
      filename: faker.system.commonFileName('jpg'),
      url: faker.image.avatarGitHub(),
      mimeType: 'image/jpeg',
    }
  })
  .build()
