import { app } from '../src/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
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


})

