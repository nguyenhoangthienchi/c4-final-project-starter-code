import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../logic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return await deleteTodo(event)
    } catch (error) {
      logger.error(`Error deleted Todo item: ${error.message}`)

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Some thing was wrong ! Please see log to detail'
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
