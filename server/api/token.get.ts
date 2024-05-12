import { getToken } from '#auth'

export default defineEventHandler(async event => getToken({ event }))
