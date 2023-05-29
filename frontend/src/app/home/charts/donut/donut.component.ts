import { Component, Input, OnInit, ViewChild } from '@angular/core'
import {
    ApexChart,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ChartComponent,
} from 'ng-apexcharts'
import { ClientService } from 'src/app/_services/client/client.service'

export type ChartOptions = {
    series: ApexNonAxisChartSeries
    chart: ApexChart
    responsive: ApexResponsive[]
    labels: any
}

@Component({
    selector: 'app-donut',
    templateUrl: './donut.component.html',
    styleUrls: ['./donut.component.css'],
})
export class DonutComponent implements OnInit {
    clients: any
    public chartOptions: Partial<ChartOptions>
    isMan: number = 0
    isWoman: number = 0
    isOthers: number = 0
    series: []
    constructor(private clientService: ClientService) {}
    ngOnInit() {
        this.donutValue()
    }

    donutValue() {
        this.clientService.index().subscribe(
            (res) => {
                this.clients = res.client
                for (let index = 0; index < res.client.length; index++) {
                    switch (this.clients[index].genre) {
                        case 'M': {
                            this.isMan += 1
                            break
                        }
                        case 'F': {
                            this.isWoman += 1
                            break
                        }
                        case 'Outros': {
                            this.isOthers += 1
                            break
                        }
                        default: {
                            break
                        }
                    }
                }
                this.chartOptions = {
                    series: [this.isMan, this.isWoman, this.isOthers],
                    chart: {
                        type: 'donut',
                    },
                    labels: ['Masculino', 'Feminino', 'Outros'],
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                }
            },
            (err) => {
                console.log(err)
            }
        )
    }
}
