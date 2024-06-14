import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { PoiTypes } from '../../app/types/models/poi_types.js'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    let index = 0
    let size = 300
    let total = 0
    do {
      const result = await this.getPois(index, size)
      total = result.total

      const pois = await this.formatPois(result)

      await db.table('pois').insert(pois)

      index += size
      if (index > total) index = total

      console.log(`Treated ${index} of ${total} POIs`)
    } while (index < total)
  }

  async getPois(index: number, size: number) {
    const endpoint = env.get('GRAPHQL_ENDPOINT')
    const query = this.getQuery()

    const variables = {
      size: size,
      from: index,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    }

    return fetch(endpoint, options)
      .then((response) => response.json())
      .then((data: any) => {
        return data.data.poi
      })
  }

  areAllLettersCapital(str: string) {
    return /[A-Z]/.test(str) && str === str.toUpperCase()
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  async formatPois(pois: any) {
    return await Promise.all(
      pois.results.map(async (item: any) => {
        const now = new Date()

        const representations = item.hasRepresentation
        const coverId = await this.getCoverId(representations)

        if (!coverId) {
          return null
        }

        const streetAddress = item.isLocatedAt[0].schema_address[0].schema_streetAddress
        const types = item.rdf_type

        const poiType = this.getTypes().find((type: any) => types.includes(type.name))
        const name = item.rdfs_label[0].value

        return {
          name: this.areAllLettersCapital(name) ? this.capitalizeFirstLetter(name) : name,
          cover_id: coverId,
          type_id: poiType!.id,
          reference: item.dc_identifier[0],
          description: item.hasDescription[0].shortDescription[0].value,
          latitude: item.isLocatedAt[0].schema_geo[0].schema_latitude[0],
          longitude: item.isLocatedAt[0].schema_geo[0].schema_longitude[0],
          city: item.isLocatedAt[0].schema_address[0].schema_addressLocality[0],
          zip_code: item.isLocatedAt[0].schema_address[0].schema_postalCode[0],
          address: streetAddress ? streetAddress[0] : null,
          updated_at: now,
          created_at: now,
        }
      })
    ).then((results) => results.filter((item: any) => item !== null))
  }

  async getCoverId(representations: any) {
    const now = new Date()

    for (const representation of representations) {
      const images = representation.ebucore_hasRelatedResource

      const validImage = images.find((image: any) => {
        const url = image.ebucore_locator[0]
        if (url) {
          const filename = url.split('/').pop()
          const extension = filename.split('.').pop().toLowerCase()
          return ['jpg', 'jpeg', 'png'].includes(extension)
        }
        return false
      })

      if (validImage) {
        const url = validImage.ebucore_locator[0]
        const filename = url.split('/').pop()
        const extension = filename.split('.').pop().toLowerCase()

        const mimeType = ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' : 'image/png'

        const res = await db
          .table('upload_files')
          .insert({
            filename,
            url,
            mime_type: mimeType,
            created_at: now,
            updated_at: now,
          })
          .returning('id')

        return res[0].id
      }
    }

    return null
  }

  getTypes() {
    return [
      {
        id: PoiTypes.MUSEUM,
        name: 'https://www.datatourisme.fr/ontology/core#Museum',
      },
      {
        id: PoiTypes.PARK,
        name: 'https://www.datatourisme.fr/ontology/core#ParkAndGarden',
      },
      {
        id: PoiTypes.MONUMENT,
        name: 'https://www.datatourisme.fr/ontology/core#RemarkableBuilding',
      },
      {
        id: PoiTypes.RELIGIOUS,
        name: 'https://www.datatourisme.fr/ontology/core#ReligiousSite',
      },
    ]
  }

  getQuery() {
    return `
      query GetPoi($size: Int!, $from: Int!) {
        poi(
          size: $size,
          from: $from,
          filters: [
            {
              dc_identifier: {
                _ne: "PNAPIC060V503HDW"
              }
              hasDescription: {
                shortDescription: {
                }
              }
              hasRepresentation: {
                ebucore_hasRelatedResource: {
                  ebucore_locator: {
                  }
                }
              }
            }
          ]
        ) {
          total
          results {
            dc_identifier
            rdf_type
            hasDescription {
              shortDescription {
                value
              }
            }
            hasRepresentation {
              ebucore_hasRelatedResource {
                ebucore_locator
              }
            }
            isLocatedAt {
              schema_geo {
                schema_latitude
                schema_longitude
              }
              schema_address {
                schema_addressLocality
                schema_postalCode
                schema_streetAddress
              }
            }
            rdfs_label {
              value
            }
          }
        }
      }
    `
  }
}
