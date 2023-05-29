import { Data } from '@angular/router'

export class Client {
    address: string
    ative: boolean
    birthday: string
    cardCode: string
    createdAt: string
    email: string
    fullName: string
    genre: string
    id: number
    image: {
        path: string
    }
    monthlyPaymentDate: Data
    phone: number
    updatedAt: Data
    access: [
        {
            id: number
            status: Boolean
            createdAt: Date
        }
    ]
}
