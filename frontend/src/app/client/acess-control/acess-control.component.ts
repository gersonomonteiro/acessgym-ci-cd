import { Component, Input, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { AccessService } from 'src/app/_services/access/access.service'

@Component({
    selector: 'app-acess-control',
    templateUrl: './acess-control.component.html',
    styleUrls: ['./acess-control.component.css'],
})
export class AcessControlComponent implements OnInit {
    @Input() client: any
    dataSuccess: {}
    constructor(
        private activeModal: NgbActiveModal,
        private accessService: AccessService
    ) {}

    accessData() {
        let status: boolean = true
        if (!this.client.ative) {
            status = false
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
        } else {
            let greenLedOn = {
                code: '1',
            }
            this.accessService.arduinoLed(greenLedOn).subscribe(
                (data) => {
                    console.log(data)
                },
                (err) => {
                    console.log(err)
                }
            )
        }
        this.dataSuccess = {
            cardCode: this.client.cardCode,
            status: status,
        }

        this.accessService.store(this.dataSuccess).subscribe(
            (data) => {
                console.log(data)
            },
            (err) => {
                console.log(err)
            }
        )
    }
    ngOnInit() {
        this.accessData()
        setTimeout(() =>(
            this.dismiss()
        ), 60000);
    }

    public dismiss() {
        this.activeModal.dismiss()
    }
}
