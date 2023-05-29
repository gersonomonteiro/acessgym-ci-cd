import { Injectable } from '@angular/core'
import { AddRoleComponent } from 'src/app/identity/role/add-role/add-role.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddClientComponent } from '../add-client/add-client.component'
import { AcessControlComponent } from '../acess-control/acess-control.component'
import { EditClientComponent } from '../edit-client/edit-client.component'
import { AddReciboComponent } from '../../mensalidade/add-recibo/add-recibo.component'


@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private modalService: NgbModal) {}

    public confirm(
        title: string,
        message: string,
        cardCode: string,
        btnOkText: string = 'Guardar',
        btnCancelText: string = 'Cancel',
        dialogSize: 'sm' | 'lg' = 'lg'
    ): Promise<boolean> {
        const modalRef = this.modalService.open(AddClientComponent, {
            size: dialogSize,
        })
        modalRef.componentInstance.title = title
        modalRef.componentInstance.message = message
        modalRef.componentInstance.cardCode = cardCode.trim()
        modalRef.componentInstance.btnOkText = btnOkText
        modalRef.componentInstance.btnCancelText = btnCancelText

        return modalRef.result
    }

    public openAcessControllModal(
        title: string,
        message: string,
        client: object,
        dialogSize: 'sm' | 'lg' = 'lg'
    ): Promise<boolean> {
        const modalRef = this.modalService.open(AcessControlComponent, {
            size: dialogSize,
        })
        modalRef.componentInstance.title = title
        modalRef.componentInstance.message = message
        modalRef.componentInstance.client = client
        return modalRef.result
    }

    public openEditDialog(
        title: string,
        message: string,
        client: object,
        btnOkText: string = 'Guardar',
        btnCancelText: string = 'Cancel',
        dialogSize: 'sm' | 'lg' = 'lg'
    ): Promise<boolean> {
        const modalRef = this.modalService.open(EditClientComponent, {
            size: dialogSize,
        })
        modalRef.componentInstance.title = title
        modalRef.componentInstance.message = message
        modalRef.componentInstance.client = client
        modalRef.componentInstance.btnOkText = btnOkText
        modalRef.componentInstance.btnCancelText = btnCancelText
        return modalRef.result
    }

    public openAddReciboDialog(
        title: string,
        message: string,
        btnOkText: string = 'Guardar',
        btnCancelText: string = 'Cancel',
        dialogSize: 'sm' | 'lg' = 'lg'
    ): Promise<boolean> {
        const modalRef = this.modalService.open(AddReciboComponent, {
            size: dialogSize,
        })
        modalRef.componentInstance.title = title
        modalRef.componentInstance.message = message
        modalRef.componentInstance.btnOkText = btnOkText
        modalRef.componentInstance.btnCancelText = btnCancelText
        return modalRef.result
    }
}
