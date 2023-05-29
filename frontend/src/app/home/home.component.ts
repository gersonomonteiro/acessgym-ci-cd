import { ClientService } from './../_services/client/client.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { User } from 'src/app/_model/user'
import { AuthService } from '../_services/auth/auth.service'
import { TokenStorageService } from '../_services/auth/token-storage.service'
import { Socket } from 'ngx-socket-io'
import { ModalService } from '../client/modal/modal.service'
import { AccessService } from '../_services/access/access.service'
import { ConfirmationDialogService } from 'src/app/shered/confirmation-dialog/confirmation-dialog.service'


interface Access {
    id: number
    status: Boolean
    createdAt: Date
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    currentUser: User
    avatar: any
    public mostrarUserProfie: boolean = false
    numeroClients: number = 0
    cardCode: string
    client: any
    numeroClientsAtivo: number = 0
    numeroClientsInativo: number = 0
    x: number = 0
    numeroAcessoHj: number = 0
    access: Access[]

    public contentLoaded: boolean = false

    constructor(
        private authService: AuthService,
        private tokenStorage: TokenStorageService,
        private router: Router,
        private clientService: ClientService,
        private socket: Socket,
        private modalService: ModalService,
        private accessService: AccessService,
        private confirmationDialogService: ConfirmationDialogService
    ) {}

    ngOnInit() {
        this.onCardRoaded()
        this.numberOfClients()
        this.totalAcessoHj()
        console.log(`contentLoaded: ${this.contentLoaded}`)
    }

    logout() {
        this.authService.signOut()
        //this.router.navigate(['/login']);
    }

    numberOfClients() {
        this.clientService.index().subscribe((res) => {
            this.client = res.client
            this.numeroClients = res.client.length

            for (let i = 0; i < this.numeroClients; i++) {
                if (this.client[i].ative) {
                    this.numeroClientsAtivo += 1
                } else {
                    this.numeroClientsInativo += 1
                }
            }
        })
    }

    public onCardRoaded() {
        this.socket.on('arduino:data', (data) => {
            //observer.next(data);
            this.cardCode = data.value
            const cardCodeJson = { cardCode: data.value.trim() }
            this.clientService.show(cardCodeJson).subscribe((res) => {
                if (res.client) {
                    this.modalService.openAcessControllModal('', '', res.client)                  
                    
                } else {
                    let redLedOn = {
                        code: '0',
                    }
                    this.accessService.arduinoLed(redLedOn).subscribe(
                        (data) => {
                            console.log(data)
                        },
                        (err) => {
                            console.log(err)
                        }
                    )
                    let message = 'O Cliente com o cartão inserido não existe, pretende introduzir?'
                    this.openConfirmationDialog(message)               
                }
            })
        })
        
    }

    public openConfirmationDialog(message) {                
        this.confirmationDialogService
            .confirm('Por favor confirma..', message)
            .then((confirmed) => {
                if (confirmed){
                        this.modalService.confirm('', '', this.cardCode)
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

    totalAcessoHj() {
        let accessData
        this.accessService.index().subscribe((res) => {
            this.access = res.access

            let diaHj = new Date()

            let dataHj =
                diaHj.getUTCFullYear() +
                '/' +
                (diaHj.getMonth() + 1) +
                '/' +
                diaHj.getUTCDate()

            for (let index = 0; index < this.access.length; index++) {
                accessData =
                    new Date(this.access[index].createdAt).getUTCFullYear() +
                    '/' +
                    (new Date(this.access[index].createdAt).getMonth() + 1) +
                    '/' +
                    new Date(this.access[index].createdAt).getUTCDate()
                if (dataHj === accessData && this.access[index].status) {
                    this.numeroAcessoHj++
                }
            }
        })
    }
}
