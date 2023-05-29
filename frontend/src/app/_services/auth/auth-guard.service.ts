import { Injectable } from '@angular/core'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'
import { TokenStorageService } from './token-storage.service'

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService {
    constructor(
        private tokenStorageService: TokenStorageService,
        private router: Router
    ) {}

    canActivate(): boolean {
        if (this.tokenStorageService.loggedIn()) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }
    }
}
