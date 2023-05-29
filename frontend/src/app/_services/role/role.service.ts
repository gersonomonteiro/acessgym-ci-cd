import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

const ROLE_API_URL = 'http://localhost:8080/api'

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private http: HttpClient) {}

    show(): Observable<any> {
        return this.http.get(ROLE_API_URL + '/roles')
    }

    getRole(id): Observable<any> {
        return this.http.get(ROLE_API_URL + `/role/${id}`, id)
    }

    store(role): Observable<any> {
        return this.http.post(ROLE_API_URL + '/role', role)
    }

    updatePermission(role, id): Observable<any> {
        return this.http.post(
            ROLE_API_URL + `/roleaddpermission/${id}`,
            role,
            id
        )
    }

    roleUpdateUser(users, id): Observable<any> {
        return this.http.post(ROLE_API_URL + `/roleupdateuser/${id}`, users, id)
    }

    update(role, id): Observable<any> {
        return this.http.put(ROLE_API_URL + `/role/${id}`, role, id)
    }

    remove(id): Observable<any> {
        return this.http.delete(ROLE_API_URL + `/role/${id}`, id)
    }
}
