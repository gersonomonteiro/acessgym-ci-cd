import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const ACCESS_API_URL = 'http://localhost:8080/api'

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor(private http: HttpClient) {}

    sendemail(message): Observable<any> {
        return this.http.post(ACCESS_API_URL + '/sendreceiptemail', message)
    }
}
