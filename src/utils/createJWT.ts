import { SignJWT } from 'jose'
import { userAgent } from './userAgent'

const ALG = 'HS256'
const SECRET = new TextEncoder().encode(Bun.env.JWT_SECRET)

export default async function createJWT(user: string) {
  const jwt = await new SignJWT({})
    .setSubject(user)
    .setExpirationTime('1h')
    .setIssuer(userAgent)
    .setIssuedAt(Date.now())
    .setProtectedHeader({ alg: ALG })
    .sign(SECRET)

  return jwt
}
