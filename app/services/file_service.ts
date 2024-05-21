import UploadFile from '#models/upload_file'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'node:fs'
import * as Minio from 'minio'

export default class FileService {
  private client: any
  constructor() {
    this.client = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    })
  }

  async store(file: MultipartFile) {
    await this.client.fPutObject('somebucketname', file.clientName, file.tmpPath!, {
      'Content-Type': file.type + '/' + file.subtype,
    })

    const url = await this.client.presignedGetObject(
      'somebucketname',
      file.clientName,
      60 * 60 * 24
    )
    console.log(url)

    const publicUrl = 'http://localhost:9000/somebucketname/' + file.clientName
    console.log(publicUrl)

    // const blob = await put(file.clientName, data, {
    //   access: 'public',
    // })

    const fileModel = await UploadFile.create({
      filename: file.clientName,
      url: publicUrl,
      mimeType: file.type + '/' + file.subtype,
    })

    return fileModel
  }

  async delete(file: UploadFile) {
    console.log('deleted')
    // await del(file.url)

    // await file.delete()
  }
}
