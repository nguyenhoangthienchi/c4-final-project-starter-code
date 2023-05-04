import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../logic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const createdTodo = await createTodo(event)

      logger.info(`Todo item created: ${createdTodo}`)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: createdTodo
        })
      }
    } catch (error) {
      logger.error(`Error creating Todo item: ${error.message}`)

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not create Todo item'
        })
      }
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
