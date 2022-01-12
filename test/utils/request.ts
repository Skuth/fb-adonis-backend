import supertest from "supertest"

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

export const request = supertest(BASE_URL)
