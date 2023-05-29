import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_URL = 'http://localhost:8080/api/user'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getUserByEmail(user): Observable<any> {
        return this.http.post(API_URL + '/id', user)
    }

    update(user, id): Observable<any> {
        return this.http.put(API_URL + `/${id}`, user, id)
    }

    updatePwd(data, id): Observable<any> {
        return this.http.put(API_URL + `/updatepwd/${id}`, data, id)
    }

    list(): Observable<any> {
        return this.http.get(API_URL)
    }

    remove(id): Observable<any> {
        return this.http.delete(API_URL + `/${id}`, id)
    }
}
