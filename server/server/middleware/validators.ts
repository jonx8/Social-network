import {checkSchema} from 'express-validator'
import UserModel from "../models/UserModel";

const userModel: UserModel = new UserModel();

function usernameUnique(value: string): boolean {
    return !userModel.findByUsername(value);
}


export const signUpValidator = checkSchema(
    {
        username: {
            trim: true,
            notEmpty: {
                errorMessage: "Username is required"
            },
            isLength: {
                options: {min: 4, max: 32},
                errorMessage: "Username length must be between 4 and 32"
            },
            usernameDoesNotExists: {
                custom: usernameUnique,
                errorMessage: "Username already exists",
                bail: true
            }
        },
        email: {
            isEmail: {
                errorMessage: "Invalid email"
            }
        },
        fullName: {
            trim: true,
            notEmpty: {
                errorMessage: "Full name field is required"
            },
            isLength: {
                options: {max: 50, min: 8},
                errorMessage: "Full name length must be between 8 and 50"
            }
        },
        password: {
            isLength: {
                options: {min: 6, max: 20},
                errorMessage: "Password length must be between 6 and 20"
            }
        }
    }
)


export const profileUpdateValidator = checkSchema(
    {
        fullName: {
            trim: true,
            notEmpty: {
                errorMessage: "Full name field is required"
            },
            isLength: {
                options: {max: 50, min: 8},
                errorMessage: "Full name length must be between 8 and 50"
            }
        },
        birthDate: {
            isDate: {
                errorMessage: "Invalid date format. Use YYYY-MM-DD"
            }
        },
        avatar: {
            notEmpty: {
                errorMessage: "Avatar must be specified"
            }
        },
        status: {
            matches: {
                options: [/^(Активный|Заблокирован|Не подтвержден)$/],
                errorMessage:
                    "Invalid status"
            }
        },
        isAdmin: {
            isBoolean: {
                errorMessage: "isAdmin must be boolean"
            }
        }
    }
)

export const conversationValidator = checkSchema({
    id: {
        isInt: {
            errorMessage: "Invalid id; id must be integer"
        }
    },
    participants: {
        isArray: {
            options: {max: 2, min: 2},
            errorMessage: "Participants must be array with length 2",
        }
    },
    messages: {}

});