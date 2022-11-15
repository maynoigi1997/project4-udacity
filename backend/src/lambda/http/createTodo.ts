import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Handling createTodo event', {event});
    
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    
    // TODO: Implement creating a new TODO item   
    if (!newTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Error: Name of to do task is empty !'
        })
      }
    }

    const newItem = await createTodo(newTodo, getUserId(event))

    return {
      statusCode: 201, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
