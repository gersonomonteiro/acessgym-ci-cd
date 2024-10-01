import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ResetPasswordComponent } from 'src/app/identity/user/reset-password/reset-password.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  public resetUserPasswordDialog(
    id: number,
    btnOkText: string = 'Guardar',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'
): Promise<boolean> {
    const modalRef = this.modalService.open(ResetPasswordComponent, {
        size: dialogSize,
    })
    modalRef.componentInstance.id = id
    modalRef.componentInstance.btnOkText = btnOkText
    modalRef.componentInstance.btnCancelText = btnCancelText
    return modalRef.result
}

}
