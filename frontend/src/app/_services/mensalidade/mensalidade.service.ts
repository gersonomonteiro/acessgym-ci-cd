import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { constants } from '../../common/constants/backend'

const API_URL = 'http://localhost:8080/api'

@Injectable({
    providedIn: 'root',
})
export class MensalidadeService {
    constructor(private http: HttpClient) {}

    show(FilterBydata): Observable<any> {
        return this.http.post(`${API_URL}/receipts`, FilterBydata)
    }

    store(monthlyPayment): Observable<any> {
        return this.http.post(`${API_URL}/receipt`, monthlyPayment)
    }
}
