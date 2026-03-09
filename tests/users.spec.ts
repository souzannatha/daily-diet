import { app } from '../src/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { execSync } from 'node:child_process'

describe('Users Route', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'New User',
        email: 'userdailydiet@gmail.com',
      })
      .expect(201)
  })
})
