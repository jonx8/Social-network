import {app} from '../app';
import supertest from "supertest";


describe('PUT /api/users/1', () => {
    test('Correct update', async () => {
        const response = await supertest(app)
            .put('/api/users/1')
            .send({
                "username": "korytov",
                "fullName": "Корытов Павел Валерьевич",
                "avatar": "/public/images/default-avatar.png",
                "status": "Активный",
                "isAdmin": false,
                "birthDate": "2003-12-02",
                "email": "xekoro10@gmail.com"
            });
        expect(response.statusCode).toBe(200);
    });
    test('Missing field', async () => {
        const response = await supertest(app)
            .put('/api/users/1')
            .send({
                "username": "korytov",
                "fullName": "Корытов Павел Валерьевич",
                "avatar": "/public/images/default-avatar.png",
                "isAdmin": false,
                "birthDate": "2003-06-02",
                "email": "xekoro10@gmail.com"
            });
        expect(response.body.errors[0].msg).toBe("Invalid status");
        expect(response.statusCode).toBe(400);
    });

});