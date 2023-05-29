import { Component, OnInit } from '@angular/core'
import { ConfirmationDialogService } from 'src/app/shered/confirmation-dialog/confirmation-dialog.service'
import { Client } from 'src/app/_model/client'
import { ClientService } from 'src/app/_services/client/client.service'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { ModalService } from '../modal/modal.service'

@Component({
    selector: 'app-list-client',
    templateUrl: './list-client.component.html',
    styleUrls: ['./list-client.component.css'],
})
export class ListClientComponent implements OnInit {
    clients: Client[]
    avatarBaseUrl: string = 'http://localhost:8080/api/uploads/'
    avatarApiUrl: string = 'https://ui-avatars.com/api/?background=random&name='

    page = 1
    pageSize = 5
    collectionSize: number
    currentRate = 8

    constructor(
        private clientService: ClientService,
        private modalService: ModalService,
        private confirmationDialogService: ConfirmationDialogService,
        private notificacaoService: NotificacaoService
    ) {}

    ngOnInit() {
        this.cliente()
    }
    cliente() {
        this.clientService.index().subscribe((res) => {
            this.clients = res.client
            this.collectionSize = this.clients.length
        })
    }
    onClickMe() {
        this.modalService.confirm('', '', '')
    }

    openEditDialog(id) {
        this.clientService.showById(id).subscribe((res) => {
            this.modalService.openEditDialog('', '', res.client)
        })
    }

    public openConfirmationDialog(id, index) {
        this.confirmationDialogService
            .confirm('Por favor confirma..', 'Você realmente quer apagar... ?')
            .then((confirmed) => {
                if (confirmed) {
                    this.removeClient(id)
                    this.clients.splice(index, 1)
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

    removeClient(id) {
        this.clientService.remove(id).subscribe(
            (client) => {
                console.log(client)
                this.ToasterSuccess(client.message)
                //window.location.reload()
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
        console.log(`client id ${id}`)
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
