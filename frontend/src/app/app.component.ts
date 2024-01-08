import { Component, OnInit } from '@angular/core'
import { AuthGuardService } from './_services/auth/auth-guard.service'
import { TokenStorageService } from './_services/auth/token-storage.service'
import { jwtDecode } from "jwt-decode";
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'AcessGym'

    constructor(
        private router: ActivatedRoute,
        private routerN: Router, 
        private authGuardService: AuthGuardService,
        private tokenStorageService: TokenStorageService
    ) {}
    
    isLoggedIn = this.authGuardService.canActivate()

    ngOnInit() {
        
        const token = this.tokenStorageService.getToken()
        if (!token && this.router.snapshot.url[0].path === '/home') {
            this.routerN.navigate(['/login'])
        } else {
            const decoded = jwtDecode(token);
            console.log('decoded.exp: ' + decoded.exp)
            console.log('Date.now: ' + Date.now() / 1000)
            if (decoded.exp < Date.now() / 1000) {
                console.log('Token invalido')
                this.routerN.navigate(['/login'])
                this.tokenStorageService.removeToken()
            }
            console.log('login')
        }
    }
}
