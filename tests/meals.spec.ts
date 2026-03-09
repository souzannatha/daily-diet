import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from '../src/app'
import { execSync } from "node:child_process";
import request from 'supertest'


describe('Meals Route', () => {

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

  it('should be able create a new meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New User',
      email: 'userdailydiet@gmail.com'
    })

    const cookies = createUserResponse.get('Set-Cookie')!

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Bread and Eggs',
      description: 'bread and eggs description',
      is_on_diet: true,
      date: '2026-03-09',
    }).expect(201)
  })

  it('should be to list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New User',
      email: 'userdailydiet@gmail.com'
    }).expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Bread and Eggs',
      description: 'bread and eggs description',
      is_on_diet: true,
      date: String(new Date().toISOString)
    }).expect(201)


    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Lunch',
      description: 'lunch time!',
      is_on_diet: false,
      date: new Date().toISOString()
    }).expect(201)

    const listMealResponse = await request(app.server).get('/meals').set('Cookie', cookies).expect(200)

    expect(listMealResponse.body.meals).toHaveLength(2)

    expect(listMealResponse.body.meals).toMatchObject([
      {
        name: 'Bread and Eggs',
        description: 'bread and eggs description',
      },
      {
        name: 'Lunch',
        description: 'lunch time!',
      },
    ])
  })


  it('should be to get a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New User',
      email: 'userdailydiet@gmail.com'
    }).expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Bread and Eggs',
      description: 'bread and eggs description',
      is_on_diet: true,
      date: new Date().toISOString()
    }).expect(201)

    const listMealResponse = await request(app.server).get('/meals').set('Cookie', cookies).expect(200)

    const mealId = listMealResponse.body.meals[0].id

    const getMealResponse = await request(app.server).get(`/meals/${mealId}`).set('Cookie', cookies).expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Bread and Eggs',
        description: 'bread and eggs description',
      })
    )
  })

})


