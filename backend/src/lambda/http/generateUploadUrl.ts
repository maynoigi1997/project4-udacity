import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { AttachmentUtils } from '../../helpers/attachmentUtils'

const logger = createLogger('generateUploadUrl')
const attachmentUtils = new AttachmentUtils();

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Handling generateUploadUrl event', {event})

    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(todoId, getUserId(event))

    return {
      statusCode: 201, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }    
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
