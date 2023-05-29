import { Component, Input, OnInit } from '@angular/core'
import { User } from 'src/app/_model/user'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { RoleService } from 'src/app/_services/role/role.service'
import { UserService } from 'src/app/_services/user/user.service'
import { ConfirmationDialogService } from '../../../shered/confirmation-dialog/confirmation-dialog.service'

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
    users: User[]
    showAddUser: boolean = false
    numeroRoles: number
    searchText
    avatarBaseUrl: string = 'http://localhost:8080/api/uploads/'
    avatarApiUrl: string = 'https://ui-avatars.com/api/?background=random&name='

    page = 1
    pageSize = 5
    collectionSize: number
    currentRate = 8

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private confirmationDialogService: ConfirmationDialogService,
        private notificacaoService: NotificacaoService
    ) {}

    ngOnInit() {
        this.userService.list().subscribe((res) => {
            this.users = res.user
            this.collectionSize = this.users.length
        })
        this.getNumeroRole()
    }

    onClickMe() {
        this.showAddUser = !this.showAddUser
    }

    getNumeroRole() {
        this.roleService.show().subscribe((res) => {
            this.numeroRoles = res.role
        })
    }

    public openConfirmationDialog(id, index) {
        this.confirmationDialogService
            .confirm('Por favor confirma..', 'Você realmente quer apagar... ?')
            .then((confirmed) => {
                if (confirmed) {
                    this.removeUser(id)
                    this.users.splice(index, 1)
                } else {
                    console.log('not confirmed')
                }
            })
            .catch(() =>
                console.log(
                    'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
                )
            )
    }

    removeUser(id) {
        this.userService.remove(id).subscribe(
            (role) => {
                console.log(role)
                this.ToasterSuccess(role.message)
                //window.location.reload()
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
        console.log(`role id ${id}`)
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
