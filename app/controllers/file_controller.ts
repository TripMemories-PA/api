import FileService from '#services/file_service'
import { storeFileValidator } from '#validators/file/store_file_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FileController {
  constructor(protected fileService: FileService) {}

  async store({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(storeFileValidator)

    const uploadedFile = await this.fileService.store(file)

    return response.created(uploadedFile)
  }
}
