import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import {ConfirmationDialogService} from '../../shered/confirmation-dialog/confirmation-dialog.service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public data: any; 
  constructor(private socket: Socket, private confirmationDialogService: ConfirmationDialogService) { }



public notification() {
 return Observable.create((observer) =>{
   this.socket.on('notification', data => {
    observer.next(data);
    this.confirmationDialogService.confirm('Por favor confirma..', 'Você realmente quer apagar... ?')

  }); 
})

}
}
