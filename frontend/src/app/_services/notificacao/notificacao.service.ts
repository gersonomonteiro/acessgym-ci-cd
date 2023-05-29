import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message){
    this.toastr.success(message)
}

showError(message, title, toastConfig){
    this.toastr.error(message,title,toastConfig)
}

showInfo(message, title){
    this.toastr.info(message, title)
}

showWarning(message, title){
    this.toastr.warning(message, title)
}
}
