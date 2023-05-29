import { Component, OnInit } from '@angular/core'
import { NgbTypeaheadWindow } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { PermissionService } from 'src/app/_services/permission/permission.service'
import { RoleService } from 'src/app/_services/role/role.service'
import { ConfirmationDialogService } from '../../../shered/confirmation-dialog/confirmation-dialog.service'

@Component({
    selector: 'app-list-role',
    templateUrl: './list-role.component.html',
    styleUrls: ['./list-role.component.css'],
})
export class ListRoleComponent implements OnInit {
    roles: []
    showAddRole: boolean = false
    numeroPermissions: number

    page = 1
    pageSize = 5
    collectionSize: number
    currentRate = 8

    constructor(
        private roleService: RoleService,
        private notificacaoService: NotificacaoService,
        private confirmationDialogService: ConfirmationDialogService,
        private permissionService: PermissionService
    ) {}

    ngOnInit() {
        this.roleService.show().subscribe((res) => {
            this.roles = res.role
            console.log(this.roles)
            this.collectionSize = this.roles.length
        })
        this.getPermissions()
    }

    onClickMe() {
        this.showAddRole = !this.showAddRole
    }

    public openConfirmationDialog(id, i) {
        this.confirmationDialogService
            .confirm('Por favor confirma..', 'Você realmente quer apagar... ?')
            .then((confirmed) => {
                if (confirmed) {
                    this.removeRole(id)
                    this.roles.splice(i, 1)
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

    removeRole(id) {
        this.roleService.remove(id).subscribe(
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

    getPermissions() {
        this.permissionService.show().subscribe((res) => {
            this.numeroPermissions = res.permission
        })
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
