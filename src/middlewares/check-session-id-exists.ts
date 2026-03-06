import { FastifyReply, FastifyRequest } from "fastify";

export function CheckSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  let sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
