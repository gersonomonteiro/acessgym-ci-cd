import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { PermissionService } from 'src/app/_services/permission/permission.service'
import { RoleService } from 'src/app/_services/role/role.service'
import { UserService } from 'src/app/_services/user/user.service'

interface Role {
    name: string
    description: string
    permission: [
        {
            id: number
            name: string
        }
    ]
    users: [
        {
            id: number
            email: string
        }
    ]
}

@Component({
    selector: 'app-view-role',
    templateUrl: './view-role.component.html',
    styleUrls: ['./view-role.component.css'],
})
export class ViewRoleComponent implements OnInit {
    idRole
    id: number
    role: Role
    permission: string[] = []
    user: string[] = []
    allPermissions: any
    allUsers: any
    Form: any
    Form2: any
    FormAddUserRole: any
    updatedPermission: string[] = []
    showBtn: boolean = false
    iditIcon: boolean = true

    constructor(
        private route: ActivatedRoute,
        private roleService: RoleService,
        private userService: UserService,
        private permissionService: PermissionService,
        private formBuilder: FormBuilder,
        private notificacaoService: NotificacaoService
    ) {
        this.Form = this.formBuilder.group({
            permissions: this.formBuilder.array([], [Validators.required]),
        })

        this.Form2 = this.formBuilder.group({
            name: ['', Validators.required],
        })

        this.FormAddUserRole = this.formBuilder.group({
            users: this.formBuilder.array([], [Validators.required]),
        })
    }

    ngOnInit() {
        this.showRole()
        this.Form2.disable()
        this.getPermissions()
        this.getUsers()
    }

    showRole() {
        this.route.queryParams.subscribe((params) => {
            this.idRole = params.idRole
        })
        this.roleService.getRole(this.idRole).subscribe((res) => {
            this.role = res.role
            const permissions: FormArray = this.Form.get(
                'permissions'
            ) as FormArray

            for (let index = 0; index < this.role.permission.length; index++) {
                this.permission.push(this.role.permission[index].name)
                permissions.push(
                    new FormControl(this.role.permission[index].name)
                )
            }
            const users: FormArray = this.FormAddUserRole.get(
                'users'
            ) as FormArray
            for (let index = 0; index < this.role.users.length; index++) {
                this.log(this.role.users.length)
                this.user.push(this.role.users[index].email)
                this.log(this.role.users[index].id)
                users.push(new FormControl(this.role.users[index].id))
            }
        })
    }
    contansPermission(permission: string) {
        if (this.permission.indexOf(permission) > -1) {
            return true
        } else {
            return false
        }
    }
    contansUser(user: string) {
        if (this.user.indexOf(user) > -1) {
            return true
        } else {
            return false
        }
    }

    getPermissions() {
        this.permissionService.show().subscribe((res) => {
            this.allPermissions = res.permission
        })
    }
    getUsers() {
        this.userService.list().subscribe((res) => {
            this.allUsers = res.user
        })
    }

    log(s: any) {
        console.log(s)
    }

    onCheckboxChange(e) {
        const permissions: FormArray = this.Form.get('permissions') as FormArray

        if (e.target.checked) {
            permissions.push(new FormControl(e.target.value))
        } else {
            let i: number = 0
            permissions.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    permissions.removeAt(i)
                    return
                }
                i++
            })
        }
    }

    onCheckboxAddUserRoleChange(e) {
        const users: FormArray = this.FormAddUserRole.get('users') as FormArray

        if (e.target.checked) {
            users.push(new FormControl(e.target.value))
        } else {
            let i: number = 0
            users.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    users.removeAt(i)
                    return
                }
                i++
            })
        }
    }

    onSubmit(id): void {
        console.log(this.Form.value)
        this.log(id)
        this.roleService.updatePermission(this.Form.value, id).subscribe(
            (role) => {
                console.log(role)
                this.ToasterSuccess(role.message)
                window.location.reload()
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
    }
    onSubmitRoleName(id): void {
        console.log(this.Form2.value)
        this.log(id)
        this.roleService.update(this.Form2.value, id).subscribe(
            (role) => {
                console.log(role)
                this.ToasterSuccess(role.message)
                this.cancel2()
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
    }

    onSubmitAddUserRole(id): void {
        console.log(this.FormAddUserRole.value)
        this.roleService
            .roleUpdateUser(this.FormAddUserRole.value, id)
            .subscribe(
                (role) => {
                    console.log(role)
                    this.ToasterSuccess(role.message)
                },
                (err) => {
                    console.log(err)
                    this.ToasterError(err, 'Error', '')
                }
            )
    }

    enableForm2() {
        this.Form2.enable()
        this.showBtn = !this.showBtn
        this.iditIcon = !this.iditIcon
    }
    cancel2() {
        this.Form2.disable()
        this.showBtn = !this.showBtn
        this.iditIcon = !this.iditIcon
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
