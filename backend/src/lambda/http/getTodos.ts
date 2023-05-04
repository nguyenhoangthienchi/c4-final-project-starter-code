import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {
  getTodosForUser,
  getTodosWithPagination
} from '../../logic/todos'
import { createLogger } from '../../utils/logger'
import * as createError from 'http-errors'
const logger = createLogger('getTodoHandler')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const nextKey = parseNextKeyParameter(event)
      const limit = parseLimitKeyParameter(event)

      if (!limit) {
        const todoItems = await getTodosForUser(event)
        return {
          statusCode: 200,
          body: JSON.stringify({
            items: todoItems
          })
        }
      } else {
        const todoItemsWithPagination = await getTodosWithPagination(
          event,
          nextKey,
          limit
        )
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            items: todoItemsWithPagination.Items,
            nextKey: encodeNextKey(todoItemsWithPagination.LastEvaluatedKey)
          })
        }
      }
    } catch (error) {
      logger.error(`Error to get list: ${error.message}`)

      // customize error code
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Can not get list !'
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

function parseNextKeyParameter(event) {
  const nextKeyStr = getQueryParameter(event, 'nextKey')
  if (!nextKeyStr) {
    return undefined
  }
  const urlDecode = decodeURIComponent(nextKeyStr)
  return JSON.parse(urlDecode)
}

function parseLimitKeyParameter(event) {
  const limitKeyStr = getQueryParameter(event, 'limit')
  if (!limitKeyStr) {
    return undefined
  }

  const limit = parseInt(limitKeyStr, 10)

  if (limit <= 0) {
    throw new createError.NotFound(`Please check parameter !`)
  }
  return limit
}

function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  console.log(queryParams)
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}
