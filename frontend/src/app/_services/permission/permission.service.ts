import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from "src/app/common/constants/backend"

const PERMISSION_API_URL = `${constants.BASE_API_URL}`;

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  show(): Observable<any> {
    return this.http.get(PERMISSION_API_URL + '/permissions');
  }

  store(permission): Observable<any> {
    return this.http.post(PERMISSION_API_URL + '/permission', permission);
  }

  update(permission, id): Observable<any> {
    return this.http.put(PERMISSION_API_URL + `/permission/${id}`, permission, id);
  }

  remove(id): Observable<any> {
    return this.http.delete(PERMISSION_API_URL + `/permission/${id}`, id);
  }
}
