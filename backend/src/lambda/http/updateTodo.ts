import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../logic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodoHandler')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      if (!event.body || !event.pathParameters.todoId) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Missing required fields.'
          })
        }
      }

      return await updateTodo(event)
    } catch (error) {
      logger.error(`Error creating Todo item: ${error.message}`)

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not update Todo item ! Please check log to detail !'
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
