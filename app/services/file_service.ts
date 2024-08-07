import UploadFile from '#models/upload_file'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import * as Minio from 'minio'
import env from '#start/env'

export default class FileService {
  private client: Minio.Client
  private bucketName: string
  private baseUrl: string

  constructor() {
    this.bucketName = env.get('MINIO_BUCKET_NAME')

    const port = env.get('MINIO_PORT')
    const hostname = env.get('MINIO_HOST')
    const url = env.get('MINIO_URL')

    this.baseUrl = url + '/' + this.bucketName

    this.client = new Minio.Client({
      endPoint: hostname,
      port: port,
      useSSL: false,
      accessKey: env.get('MINIO_ACCESS_KEY'),
      secretKey: env.get('MINIO_SECRET_KEY'),
    })
  }

  async store(file: MultipartFile) {
    const timestamp = new Date().getTime()
    file.clientName = timestamp + '-' + file.clientName

    await this.client.fPutObject(this.bucketName, file.clientName, file.tmpPath!, {
      'Content-Type': file.type + '/' + file.subtype,
    })

    const url = this.baseUrl + '/' + file.clientName

    const fileModel = await UploadFile.create({
      filename: file.clientName,
      url: url,
      mimeType: file.type + '/' + file.subtype,
    })

    return fileModel
  }

  async delete(file: UploadFile) {
    await this.client.removeObject(this.bucketName, file.filename)

    await file.delete()
  }
}
