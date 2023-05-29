import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_model/user';
import { map, distinctUntilChanged  } from 'rxjs/operators';
import { constants} from '../../common/constants/backend'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_API  = `${constants.BASE_API_URL}/auth/`

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe();

  constructor(private http: HttpClient) { }

  signin(user){
    return this.http.post<any>(this.AUTH_API +'signin', user)
    .pipe(map(userData => {
      return userData;
    }));
  }

  signup(user): Observable<any> {
    return this.http.post(this.AUTH_API + 'signup', user);
  }

  signOut() {
    window.localStorage.clear();
    this.currentUserSubject.next(null);
  }

}
