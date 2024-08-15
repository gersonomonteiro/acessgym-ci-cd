import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import * as moment from 'moment'
import 'moment/locale/ru'
import 'moment-timezone'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ClientService } from 'src/app/_services/client/client.service'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.css'],
})
export class EditClientComponent implements OnInit {
    @Input() title: string
    @Input() message: string
    @Input() client: any
    @Input() btnOkText: string
    @Input() btnCancelText: string
    genrets: any = ['M', 'F', 'Outros']
    Form: any
    avatar: any
    options: any = { format: 'YYYY/MM/DD' }
    //isAtive: boolean = false;
    value: boolean

    constructor(
        private formBuilder: FormBuilder,
        private activeModal: NgbActiveModal,
        private clientService: ClientService,
        private notificacaoService: NotificacaoService
    ) {
        this.Form = this.formBuilder.group({
            fullName: ['', Validators.required],
            phone: ['', Validators.required],
            email: [''],
            address: ['', Validators.required],
            birthday: [moment().toDate(), Validators.required],
            //cardCode: [this.cardCode, Validators.required],
            img: [null],
        })
    }

    ngOnInit() {
        this.value = this.client.ative
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
    removeAvatar() {
        this.avatar = null
        this.fileName = null
    }

    changeSuit(e) {
        this.Form.get('genre').setValue(e.target.value, {
            onlySelf: true,
        })
    }

    fileName: string

    onSelectFile(event) {
        // called each time file input changes
        let reader = new FileReader() // HTML5 FileReader API
        const file = (event.target as HTMLInputElement).files[0]
        reader.readAsDataURL(file) // read file as data url
        this.fileName = file.name
        reader.onload = () => {
            // called once readAsDataURL is completed
            this.avatar = reader.result
            this.Form.patchValue({
                img: file,
            })
            this.Form.get('img').updateValueAndValidity()
        }
    }

    /*ativeCamera(){
    this.isAtive = !this.isAtive
  }
  // latest snapshot
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.ativeCamera()
  }*/

    onSubmit(id): void {
        const formData = new FormData()

        formData.append('fullName', this.Form.get('fullName').value)
        formData.append('phone', this.Form.get('phone').value)
        formData.append('email', this.Form.get('email').value)
        //formData.append('genre', this.Form.get('genre').value)
        formData.append('address', this.Form.get('address').value)
        formData.append('birthday', this.Form.get('birthday').value)
        //formData.append('cardCode', this.Form.get('cardCode').value)
        formData.append('image', this.Form.get('img').value)

        this.clientService.update(formData, id).subscribe(
            (client) => {
                this.ToasterSuccess(client.message)
                this.Form.reset()
                //window.location.reload()
                this.decline()
            },
            (err) => {
                this.ToasterError(err, 'Error', '')
            }
        )
    }

    updateClientStatus(id) {
        this.value = !this.value
        const ative = {
            ative: this.value,
        }
        
        this.clientService.update(ative, id).subscribe(
            (res) => {
                this.ToasterSuccess(res.message)
            },
            (err) => {
                console.log(err)
                this.ToasterError(err, 'Error', '')
            }
        )
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
}
