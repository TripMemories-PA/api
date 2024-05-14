import User from '#models/user'
import { inject } from '@adonisjs/core'
import { UpdateMeRequest } from '../types/requests/me/update_me_request.js'
import FileService from './file_service.js'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export default class MeService {
  constructor(protected fileService: FileService) {}

  async get(user: User) {
    await user.load((loader) => {
      loader.load('avatar')
      loader.load('banner')
    })

    return user
  }

  async update(user: User, payload: UpdateMeRequest) {
    user.merge({
      username: payload.username,
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
    })

    const updated = await user.save()

    return updated
  }

  async storeAvatar(user: User, file: MultipartFile) {
    await user.load('avatar')

    if (user.avatar) {
      await this.fileService.delete(user.avatar)
    }

    const uploadedFile = await this.fileService.store(file)
    await user.related('avatar').associate(uploadedFile)

    return uploadedFile
  }

  async storeBanner(user: User, file: MultipartFile) {
    await user.load('banner')

    if (user.banner) {
      await this.fileService.delete(user.banner)
    }

    const uploadedFile = await this.fileService.store(file)
    await user.related('banner').associate(uploadedFile)

    return uploadedFile
  }

  async delete(user: User) {
    await user.load('avatar')
    await user.load('banner')

    if (user.avatar) {
      await this.fileService.delete(user.avatar)
    }

    if (user.banner) {
      await this.fileService.delete(user.banner)
    }

    await user.delete()
  }
}
