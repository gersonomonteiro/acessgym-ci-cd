import { Component, OnInit, Input } from '@angular/core'
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    Validators,
    ValidatorFn,
} from '@angular/forms'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { MensalidadeService } from 'src/app/_services/mensalidade/mensalidade.service'
import { ClientService } from 'src/app/_services/client/client.service'
import { Client } from 'src/app/_model/client'

@Component({
    selector: 'app-add-recibo',
    templateUrl: './add-recibo.component.html',
    styleUrls: ['./add-recibo.component.css'],
})
export class AddReciboComponent implements OnInit {
    @Input() title: string
    @Input() message: string
    @Input() btnOkText: string
    @Input() btnCancelText: string
    Form: any
    clients: Client[]
    addMesCount = 0;
    meses = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    mesesDisponiveis: string[] = [];
    precoOptions = [1000, 1500, 2000, 2500];
    descontoOptions = [0, 5, 10, 15, 20, 25, 30];

    undefined = false
    constructor(
        private mensalidadeService: MensalidadeService,
        private notificacaoService: NotificacaoService,
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private clientService: ClientService,
    ) {
        this.Form = this.formBuilder.group({
            client_id: ['', Validators.required],
            monthlyPayment: this.formBuilder.array([
                this.formBuilder.group({
                    month: ['', Validators.required],
                    price: this.precoOptions[0],
                    discount: this.descontoOptions[0],
                })]),
        })
    }
    addMensalidade() {
        this.addMesCount += 1;
        const mensalidade = this.Form.controls.monthlyPayment as FormArray
        mensalidade.push(
            this.formBuilder.group({
                month: ['', Validators.required],
                price: this.precoOptions[0],
                discount: this.descontoOptions[0]
            })
        )
    }
    getSubjectForFormArray(i, meses) {
        return i == 0 ? meses :
          this.getSubjectForFormArray(i - 1, meses.filter(x => x != this.Form.get('monthlyPayment').value[i-1].month))
      }

    desableRemoveBtn(){
        if(this.addMesCount >0){
            return false
        }else{
            return true
        }
    }

    removeMensalidade(index) {
        this.addMesCount -= 1;
        (this.Form.get('monthlyPayment') as FormArray).removeAt(index);
      }
    
    getMensalidadeFormControls(): AbstractControl[] {
        return (<FormArray> this.Form.get('monthlyPayment')).controls
    }

    ngOnInit() {
        this.atualizarMesesDisponiveis();
        this.cliente()        
    }
    atualizarMesesDisponiveis() {
        const currentMonth = new Date().getMonth(); // Obtém o mês atual (0-11)
        this.mesesDisponiveis = this.meses.slice(currentMonth); // Filtra os meses a partir do mês atual
    }
    cliente() {
        
        this.clientService.index().subscribe((res) => {
            this.clients = res.client
        })
    }

    send(values) {
        this.mensalidadeService.store(values).subscribe(
            (mensalidade) => {
                this.ToasterSuccess(mensalidade.message)
                this.Form.reset()
                window.location.reload()
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
    }
    getFilteredMeses(i: number): string[] {
        const selectedMonths = this.Form.value.monthlyPayment.map((item) => item.month);
        return this.mesesDisponiveis.filter(mes => !selectedMonths.includes(mes) || mes === this.Form.value.monthlyPayment[i].month);
    }

    isAddButtonDisabled(): boolean {
        const selectedMonths = this.Form.value.monthlyPayment.map((item) => item.month);
        return selectedMonths.length >= this.mesesDisponiveis.length;
    }

    isDuplicate(valeuForm){
        const monthlyPayment = valeuForm.monthlyPayment
        const temp = monthlyPayment.map(payment => payment.month);
        return temp.some((item, index) => temp.indexOf(item) !== index);
    }

    public saveCode(e): void {
        let find = this.clients.find((x) => x.email === e.target.value)
        if (typeof find === 'undefined') {
            this.undefined = true
            this.Form.get('client_id').setValue('')
            console.log('no tem user')
        } else {
            this.undefined = false
            this.Form.get('client_id').setValue(find.id)
        }
    }

    changeSuit(e) {
        this.Form.get('month').setValue(e.target.value, {
           onlySelf: true
        })
    }
    

    public decline() {
        this.activeModal.close(false)
    }

    public accept() {
        //this.activeModal.close(true);
        //console.log(this.Form.value)
    }

    public dismiss() {
        this.activeModal.dismiss()
    }
    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
