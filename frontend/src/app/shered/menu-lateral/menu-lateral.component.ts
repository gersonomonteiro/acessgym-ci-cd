import { Component, Input, OnInit } from '@angular/core'
import { NgxPermissionsService } from 'ngx-permissions'
import { User } from 'src/app/_model/user'

import { AuthGuardService } from 'src/app/_services/auth/auth-guard.service'
import { TokenStorageService } from 'src/app/_services/auth/token-storage.service'
import { UserService } from 'src/app/_services/user/user.service'

@Component({
    selector: 'app-menu-lateral',
    templateUrl: './menu-lateral.component.html',
    styleUrls: ['./menu-lateral.component.css'],
})
export class MenuLateralComponent implements OnInit {
    @Input() isLoggedIn: boolean
    currentUser: User
    user
    permissions: Array<string> = []
    roles: any
    numPermission: any
    numRole: any

    constructor(
        private authGuardService: AuthGuardService,
        private tokenStorage: TokenStorageService,
        private userService: UserService,
        private permissionService: NgxPermissionsService
    ) {}

    log(message: any) {
        console.log(message)
    }
    ngOnInit() {
        this.userData()
    }

    userData() {
        this.user = {
            email: this.tokenStorage.getUserEmail(),
        }
        //this.isLoggedIn = this.authGuardService.canActivate();

        this.userService.getUserByEmail(this.user).subscribe((res) => {
            this.roles = res.user.roles

            for (let i in this.roles) {
                for (let j in this.roles[i].permission) {
                    this.permissions.push(this.roles[i].permission[j].name)
                    //this.log(this.roles[i].permission[j].name)
                }
            }
            this.permissionService.addPermission(this.permissions)
        })
    }
}
