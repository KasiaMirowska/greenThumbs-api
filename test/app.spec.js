
const app = require('../src/app');

describe('app', () => {
    it('GET / responds with 200 containing "hello from green thumbs up!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'hello from green-thumbs-up!')
    })
})