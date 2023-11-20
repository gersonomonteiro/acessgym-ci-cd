import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { constants } from "src/app/common/constants/backend"

const ACCESS_API_URL = `${constants.BASE_API_URL}`

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor(private http: HttpClient) {}

    sendemail(message): Observable<any> {
        return this.http.post(ACCESS_API_URL + '/sendreceiptemail', message)
    }
}
