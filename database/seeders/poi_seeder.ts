import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    let index = 0
    let size = 100
    let total = 0

    do {
      const poi = await this.queryPoi(index, size)
      console.log('received poi')
      total = poi.total

      await db.table('pois').insert(
        await Promise.all(
          poi.results.map(async (item: any) => {
            const now = new Date()

            const images = item.hasRepresentation[0].ebucore_hasRelatedResource
            let coverId = null

            for (const image of images) {
              if (image.ebucore_locator.length > 0) {
                const url = image.ebucore_locator[0]
                const filename = url.split('/').pop()
                const extension = filename.split('.').pop().toLowerCase()

                const res = await db
                  .table('upload_files')
                  .insert({
                    filename: filename,
                    url: url,
                    mime_type: ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' : 'image/png',
                    created_at: now,
                    updated_at: now,
                  })
                  .returning('id')

                coverId = res[0].id

                break
              }
            }

            return {
              name: item.rdfs_label[0].value,
              cover_id: coverId,
              description: item.hasDescription[0].shortDescription[0].value,
              latitude: item.isLocatedAt[0].schema_geo[0].schema_latitude[0],
              longitude: item.isLocatedAt[0].schema_geo[0].schema_longitude[0],
              city: item.isLocatedAt[0].schema_address[0].schema_addressLocality[0],
              zip_code: item.isLocatedAt[0].schema_address[0].schema_postalCode[0],
              address: item.isLocatedAt[0].schema_address[0].schema_streetAddress
                ? item.isLocatedAt[0].schema_address[0].schema_streetAddress[0]
                : null,
              updated_at: now,
              created_at: now,
            }
          })
        )
      )

      index += size
      console.log(`Imported ${index} of ${total} POIs`)
    } while (index < total)
  }

  async queryPoi(index: number, size: number) {
    const endpoint = 'http://localhost:8080'
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

  getQuery() {
    return `
      query GetPoi($size: Int!, $from: Int!) {
        poi(
          size: $size,
          from: $from,
          filters: [
            {
              hasDescription: {
                shortDescription: {
                  _ne: null
                }
              }
              _or: [
                {
                  rdf_type: {
                    _eq: "https://www.datatourisme.fr/ontology/core#Museum"
                  }
                }
                {
                  rdf_type: {
                    _eq: "https://www.datatourisme.fr/ontology/core#ParkAndGarden"
                  }
                }
                {
                  rdf_type: {
                    _eq: "https://www.datatourisme.fr/ontology/core#ReligiousSite"
                  }
                }
                {
                  rdf_type: {
                    _eq: "https://www.datatourisme.fr/ontology/core#RemarkableBuilding"
                  }
                }
              ]
            }
          ]
        ) {
          total
          results {
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
