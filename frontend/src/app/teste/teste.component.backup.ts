//import { NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, OnInit, VERSION } from '@angular/core'
import { NgxPermissionsService } from 'ngx-permissions'
import { User } from '../_model/user'
import { TokenStorageService } from '../_services/auth/token-storage.service'
import { UserService } from '../_services/user/user.service'

export interface Cartoon {
    id: number
    name: string
}

@Component({
    selector: 'app-teste',
    templateUrl: './teste.component.html',
    styleUrls: ['./teste.component.css'],
})
export class TesteComponent implements OnInit {
    name: string
    currentUser: User
    user
    permissions: Array<any> = []
    roles: any
    n
    constructor(
        private permissionService: NgxPermissionsService,
        private tokenStorage: TokenStorageService,
        private userService: UserService
    ) {
        this.name = `Angular! v${VERSION.full}`
    }

    ngOnInit() {
        this.user = {
            email: this.tokenStorage.getUserEmail(),
        }
        //this.isLoggedIn = this.authGuardService.canActivate();

        this.userService.getUserByEmail(this.user).subscribe((res) => {
            this.roles = res.user.roles
            this.n = this.roles.length

            for (let index = 0; index < this.n; index++) {
                this.permissions.push([this.roles[index].name])
                this.permissionService.loadPermissions([this.roles[index].name])
            }
            console.log(this.permissions)
        })
        //this.permissionService.loadPermissions(this.permissions)
    }

    addAdminPermission() {
        this.permissionService.loadPermissions([this.roles[0].name])
    }

    removePermission() {
        this.permissionService.removePermission('ADMIN_TESTE')
    }
    value = false;
    value1;

  changed() {
    this.value1 = this.value;
  }
}
