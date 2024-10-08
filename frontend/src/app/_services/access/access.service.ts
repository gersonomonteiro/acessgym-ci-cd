import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { constants } from "src/app/common/constants/backend"

const ACCESS_API_URL = `${constants.BASE_API_URL}`

@Injectable({
    providedIn: 'root',
})
export class AccessService {
    constructor(private http: HttpClient) {}

    index(): Observable<any> {
        return this.http.get(ACCESS_API_URL + '/access')
    }

    store(data): Observable<any> {
        return this.http.post(ACCESS_API_URL + '/access', data)
    }
    arduinoLed(data): Observable<any> {
        return this.http.post(ACCESS_API_URL + '/arduinoled', data)
    }
}
