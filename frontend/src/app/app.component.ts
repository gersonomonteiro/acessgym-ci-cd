import { Component, OnInit } from '@angular/core'
import { AuthGuardService } from './_services/auth/auth-guard.service'
import { TokenStorageService } from './_services/auth/token-storage.service'
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
        private authGuardService: AuthGuardService,
        private tokenStorageService: TokenStorageService
    ) {}
    
    isLoggedIn = this.authGuardService.canActivate()

    ngOnInit() {
        
        const token = this.tokenStorageService.getToken()
        if (!token && this.router.snapshot.url[0].path === '/home') {
            window.location.reload();
        } else {
            console.log('login')
        }
    }
}
