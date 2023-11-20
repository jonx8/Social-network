import supertest from 'supertest';
import {app} from "../app";


describe('POST /api/auth/login', () => {
    test('correct credentials', async () => {
        const response = await supertest(app)
            .post("/api/auth/login")
            .send({
                "username": "xekoro10",
                "password": "password"
            });
        expect(response.body.isAdmin).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.accessToken).toBeDefined();
        expect(response.status).toBe(200);
    });

    test('incorrect credentials', async () => {
        const response = await supertest(app)
            .post('/api/auth/login')
            .send({
                "username": "xekoro10",
                "password": "incorrect"
            })
        expect(response.body.message).toBe("Authentication failed");
        expect(response.status).toBe(401);
    })

    test('missing credentials', async () => {
        const response = await supertest(app)
            .post('/api/auth/login')
            .send({
                'username': "korytov"
            })
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Missing credentials");
    });

});

describe('POST /api/auth/register', () => {
    test('Valid registration data', async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({
                "username": "user22",
                "password": "12345678",
                "fullName": "Петров Сергей Витальевич",
                "email": "lolelo@pop.org"
            })
        expect(response.statusCode).toBe(201);
    });
    test("Username already exists", async () => {

        const response = await supertest(app)
            .post('/api/auth/register')
            .send({
                "username": 'korytov',
                "password": "12345678",
                "email": "pppp@mail.ru",
                "fullName": "Петров Сергей Витальевич",
            })
        expect(response.body.errors[0].msg).toBe("Username already exists");
        expect(response.statusCode).toBe(400);
    });

    test("Empty body", async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({});
        expect(response.statusCode).toBe(400);
    });


    test("Too short username", async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({
                "username": 'aa',
                "password": "12345678",
                "email": "example@gmail.com",
                "fullName": "Петров Сергей Витальевич",
            });
        expect(response.statusCode).toBe(400);
    });


    test("Incorrect email format", async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({
                "username": 'john123',
                "password": "12345678",
                "email": "example",
                "fullName": "Петров Сергей Витальевич",
            });

        expect(response.statusCode).toBe(400);
    });


    test("Test trimming", async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({
                "username": "   user   ",
                "email": "mail@mail.io",
                "fullName": "    John Yohanson",
                "password": "gdfg1233"
            });
        expect(response.body.username).toBe("user");
        expect(response.body.fullName).toBe("John Yohanson");
        expect(response.statusCode).toBe(201);
    });

});