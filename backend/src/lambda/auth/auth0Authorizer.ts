import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-jz7scr5na2om0h4b.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  logger.info('In verify token')
  console.log('In verify token')
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info('In verify token 1')
  console.log('In verify token 1')
  if (!jwt) {
    throw Error("JWT is not valid")
  }
  logger.info('In verify token 2')
  console.log('In verify token 2')
  // const response = await Axios.get(jwksUrl)
  // const data = response.data
  // let cert = data['keys'][0].x5c[0]
  const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJdFH73CRc1IMGMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1qejdzY3I1bmEyb20waDRiLnVzLmF1dGgwLmNvbTAeFw0yMjExMTIw
MjU4NDJaFw0zNjA3MjEwMjU4NDJaMCwxKjAoBgNVBAMTIWRldi1qejdzY3I1bmEy
b20waDRiLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJlcPvsIeHImb3AW9TpfyoP0MGd+NTJAj2VSRp42Fv0sAOh8vavZDmkUoK2m
x1PMNcSL9+tuEFniUmtakMXS7uScqnKPHMB/ymSQ6FcquAmUYw5iMGDr8QIWQkjF
Evfc3YwaHtEmTsRQLE6robksAt5ZtM9RQIfvPAGKq1npQ+MnYmZRsJNVOJ+w/4D9
58RmEN04EyXatbeKOARQ6L1bjSCXmsnu+sZ0PVcvoq118t0/yoUj60nEcIoXFTnp
5fAotdAlzNbiJ5wVQY9rBiYTGlT9mDfKKWXXC8sILqYSzqmZJf71li80xJGuoDH+
3byD9PGr4lhQLuuh0aV19nuofosCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU4DW1qMtrq9y0ZSK3AVH9RcfGIqkwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBnw531+lUs8l6f/O9KvZDWrJAelZY9nh5Z3nlrdJt9
+N0LjUb9UqDoxgv/9ZS2fkyhYoQkkMpLYqKfuAWNC1NP3b6QGDuwE7ybAzQwU0Qf
LK+e/fVQ9He8CRNSxQJkRQ6D/Jtkk+oyKmuw0soKObZlob4pXLHMmSMcs071vpLe
Wx7x4uEZyrntlOpHmtyIDmZGNT/jQ0tP8YP6e18vT3oF4P6UP/zuDIzjW8gZrFV8
ZlFPYO0jG2QOXz/qGF0yrnUVy0WmcnCLtK+JFXshW4gFQlkuIdqj+GtZKE39Eh/V
rwp2Lzh6aXi/hLu+d+D46sUvQ3QBeAcoDb5zblmYMNEG
-----END CERTIFICATE-----`

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  logger.info('In verify token 3')
  console.log('In verify token 3')
  return verify(token, cert, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
