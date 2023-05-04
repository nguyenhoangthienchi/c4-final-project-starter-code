import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../logic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('uploadTodoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const presignedUrl = await createAttachmentPresignedUrl(event)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          uploadUrl: presignedUrl
        })
      }
    } catch (error) {
      logger.error(`Error creating upload image: ${error.message}`)

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not upload attachment !'
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
