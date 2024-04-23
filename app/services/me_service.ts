import User from '#models/user'
import { inject } from '@adonisjs/core'
import { UpdateMeRequest } from '../types/requests/me/update_me_request.js'
import FileService from './file_service.js'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export default class MeService {
  constructor(protected fileService: FileService) {}

  async get(user: User) {
    return await user.load('avatar')
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
    const uploadedFile = await this.fileService.store(file)

    await user.related('avatar').associate(uploadedFile)

    return uploadedFile
  }
}
