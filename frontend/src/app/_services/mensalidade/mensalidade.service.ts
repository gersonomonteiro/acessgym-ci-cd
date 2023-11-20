import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { constants } from '../../common/constants/backend'



@Injectable({
    providedIn: 'root',
})
export class MensalidadeService {
    constructor(private http: HttpClient) {}

    private API_URL = `${constants.BASE_API_URL}`
    
    show(FilterBydata): Observable<any> {
        return this.http.post(`${this.API_URL}/receipts`, FilterBydata)
    }

    store(monthlyPayment): Observable<any> {
        return this.http.post(`${this.API_URL}/receipt`, monthlyPayment)
    }
    remove(id): Observable<any> {
        return this.http.delete(`${this.API_URL}/receipt/${id}`, id);
    }
}
