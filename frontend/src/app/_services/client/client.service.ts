import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { constants } from "src/app/common/constants/backend"
const CLIENT_API_URL = `${constants.BASE_API_URL}`

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    constructor(private http: HttpClient) {}

    index(): Observable<any> {
        return this.http.get(CLIENT_API_URL + '/client')
    }

    show(cardCode): Observable<any> {
        return this.http.post(CLIENT_API_URL + '/client/id', cardCode)
    }

    showById(id): Observable<any> {
        return this.http.get(CLIENT_API_URL + `/client/${id}`, id)
    }

    store(client): Observable<any> {
        return this.http.post(CLIENT_API_URL + '/client', client)
    }

    update(client, id): Observable<any> {
        return this.http.put(CLIENT_API_URL + `/client/${id}`, client, id)
    }

    remove(id): Observable<any> {
        return this.http.delete(CLIENT_API_URL + `/client/${id}`, id)
    }
}
