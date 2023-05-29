import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Client } from 'src/app/_model/client'
import { ClientService } from 'src/app/_services/client/client.service'

@Component({
    selector: 'app-view-client',
    templateUrl: './view-client.component.html',
    styleUrls: ['./view-client.component.css'],
})
export class ViewClientComponent implements OnInit {
    cardCode
    client: Client
    avatarApiUrl: string = 'https://ui-avatars.com/api/?background=random&name='
    public value: Date[] = []
    public multiSelect: Boolean = true
    numeroAcesso: number = 0

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService
    ) {}

    ngOnInit() {
        this.showClient()
    }

    showClient() {
        this.route.queryParams.subscribe((params) => {
            this.cardCode = params
        })
        this.clientService.show(this.cardCode).subscribe((res) => {
            this.client = res.client
            console.log(this.client)

            for (let index = 0; index < this.client.access.length; index++) {
                console.log(this.client.access.length)
                if (this.client.access[index].status) {
                    this.value.push(
                        new Date(this.client.access[index].createdAt)
                    )
                    this.numeroAcesso++
                }
            }
            console.log(this.value)
        })
    }
}
