import UploadFile from '#models/upload_file'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { put } from '@vercel/blob'
import fs from 'node:fs'

export default class FileService {
  async store(file: MultipartFile) {
    const data = fs.readFileSync(file.tmpPath!)

    const blob = await put(file.clientName, data, {
      access: 'public',
    })

    const fileModel = await UploadFile.create({
      filename: file.clientName,
      url: blob.url,
      mimeType: file.type + '/' + file.subtype,
    })

    return fileModel
  }
}
