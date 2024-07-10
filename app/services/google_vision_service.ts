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
    const url =
      'https://cdn-europe1.lanmedia.fr/var/europe1/storage/images/europe1/culture/impression-soleil-levant-le-celebre-tableau-de-monet-rejoint-le-havre-3429503/44044928-1-fre-FR/Impression-Soleil-Levant-le-celebre-tableau-de-Monet-rejoint-Le-Havre.jpg'
    const [result] = await this.client.webDetection(url)

    return result.webDetection?.webEntities?.map((entity) => entity.description)
  }
}
