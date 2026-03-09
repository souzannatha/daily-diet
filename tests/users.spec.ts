import { app } from '../src/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, beforeEach, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

describe('Users Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'New User',
        email: 'userdailydiet@gmail.com',
      })
      .expect(201)
    const cookies = response.get('Set-Cookie')
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})
