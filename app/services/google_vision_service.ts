import UploadFile from '#models/upload_file'
import { ImageAnnotatorClient } from '@google-cloud/vision'

export default class GoogleVisionService {
  private client: ImageAnnotatorClient

  constructor() {
    this.client = new ImageAnnotatorClient({
      keyFilename: 'google.json',
    })
  }

  async labelDetection(file: UploadFile) {
    const [result] = await this.client.webDetection(file.url)

    return result.webDetection?.webEntities?.map((entity) => entity.description)
  }
}
