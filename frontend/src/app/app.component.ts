import { Component, OnInit } from '@angular/core'
import { AuthGuardService } from './_services/auth/auth-guard.service'
import { TokenStorageService } from './_services/auth/token-storage.service'


import { Socket } from 'ngx-socket-io'
import { ModalService } from './client/modal/modal.service'
import { AccessService } from './_services/access/access.service'
import { ConfirmationDialogService } from 'src/app/shered/confirmation-dialog/confirmation-dialog.service'
import { ClientService } from './_services/client/client.service'

import { jwtDecode } from "jwt-decode";
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'AcessGym'
    cardCode: string

    constructor(
        private router: ActivatedRoute,
        private routerN: Router, 
        private authGuardService: AuthGuardService,
        private tokenStorageService: TokenStorageService,

        
        private clientService: ClientService,
        private socket: Socket,
        private modalService: ModalService,
        private accessService: AccessService,
        private confirmationDialogService: ConfirmationDialogService
    ) {}
    
    isLoggedIn = this.authGuardService.canActivate()
        
    ngOnInit() {
        this.onCardRoaded()
        const token = this.tokenStorageService.getToken()
        if (!token && this.router.snapshot.url[0].path === '/home') {
            this.routerN.navigate(['/login'])
        } else {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
                this.isLoggedIn = false
                this.routerN.navigate(['/login'])
                this.tokenStorageService.removeToken()
            }
            console.log('login')
            this.isLoggedIn = true
        }
    }

    public onCardRoaded() {
        this.socket.on('arduino:data', (data) => {
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
}
