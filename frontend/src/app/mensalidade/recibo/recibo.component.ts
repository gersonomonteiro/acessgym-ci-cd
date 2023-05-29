import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { EmailService } from 'src/app/_services/email/email.service'
import { MensalidadeService } from 'src/app/_services/mensalidade/mensalidade.service'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { ModalService } from '../../client/modal/modal.service'
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    Validators,
    ValidatorFn,
} from '@angular/forms'

import * as moment from 'moment'

@Component({
    selector: 'app-recibo',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.css'],
})
export class ReciboComponent implements OnInit {
    RECIBO_BASE_URL: string = 'http://localhost:8080/api/uploads/'
    recibos: []
    clients: []
    
    page = 1
    pageSize = 7
    collectionSize: number
    currentRate = 8

    Form: any
    date = new Date()
    year = this.date.getFullYear() - 1;
    month: number = this.date.getMonth();
    startDate = new Date(this.date.getFullYear() - 1, this.date.getMonth(), this.date.getDate())
    endDate = new Date()
    startOptions: any = { format: 'DD-MM-YYYY'}
    endOptions: any = { format: 'DD-MM-YYYY' }

    constructor(
        private mensalidadeService: MensalidadeService,
        private notificacaoService: NotificacaoService,
        private modalService: ModalService,
        private emailService: EmailService,
        private formBuilder: FormBuilder,
    ) {
        this.Form = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
        })
    }

    getMensalidade(FilterBydata) {
        this.mensalidadeService.show(FilterBydata).subscribe((res) => {
            this.recibos = res.receipt
            this.collectionSize = this.recibos.length
        })
    }

    sendReciboByEmail(id) {
        const message = {
            id: id,
        }
        this.emailService.sendemail(message).subscribe(
            (res) => {
                this.ToasterSuccess(res.message)
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
    }
    apagar() {
        console.log('this.yearAndMonth')
    }
    update() {
        this.startOptions.maxDate = this.endDate
        this.endOptions.minDate = this.startDate

        const FilterBydata = {
            from: (new Date(this.startDate).getFullYear()) + '-' +(new Date(this.startDate).getMonth()+1).toString().padStart(2, '0') + '-' + (new Date(this.startDate).getDate().toString().padStart(2, '0')),
            to: (new Date(this.endDate).getFullYear()) + '-' +(new Date(this.endDate).getMonth()+1).toString().padStart(2, '0')+ '-' + (new Date(this.endDate).getDate().toString().padStart(2, '0')),
        }
        this.getMensalidade(FilterBydata)
    }

    ngOnInit() {
        const FilterBydata = {
            from: '',
            to: '',
        }
        this.getMensalidade(FilterBydata)
        this.endOptions.minDate = this.startDate
        this.startOptions.maxDate = this.endDate
    }

    onClickAddRecibo() {
        this.modalService.openAddReciboDialog('', '', '')
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
