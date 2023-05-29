import { Component, OnInit, Output, EventEmitter } from '@angular/core'

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke,
} from 'ng-apexcharts'
import { AccessService } from 'src/app/_services/access/access.service'

export type ChartOptions = {
    series: ApexAxisChartSeries
    chart: ApexChart
    xaxis: ApexXAxis
    stroke: ApexStroke
    tooltip: ApexTooltip
    dataLabels: ApexDataLabels
}

interface Access {
    id: number
    status: Boolean
    client: {
        genre: string
    }
    createdAt: Date
}

@Component({
    selector: 'app-spline',
    templateUrl: './spline.component.html',
    styleUrls: ['./spline.component.css'],
})
export class SplineComponent implements OnInit {
    public chartOptions: Partial<ChartOptions>
    access: Access[]
    manHr5: number = 0
    manHr6: number = 0
    manHr7: number = 0
    manHr8: number = 0
    manHr9: number = 0
    manHr10: number = 0
    manHr11: number = 0
    manHr12: number = 0
    manHr13: number = 0
    manHr14: number = 0
    manHr15: number = 0
    manHr16: number = 0
    manHr17: number = 0
    manHr18: number = 0
    manHr19: number = 0
    manHr20: number = 0
    manHr21: number = 0

    womanHr5: number = 0
    womanHr6: number = 0
    womanHr7: number = 0
    womanHr8: number = 0
    womanHr9: number = 0
    womanHr10: number = 0
    womanHr11: number = 0
    womanHr12: number = 0
    womanHr13: number = 0
    womanHr14: number = 0
    womanHr15: number = 0
    womanHr16: number = 0
    womanHr17: number = 0
    womanHr18: number = 0
    womanHr19: number = 0
    womanHr20: number = 0
    womanHr21: number = 0

    othersHr5: number = 0
    othersHr6: number = 0
    othersHr7: number = 0
    othersHr8: number = 0
    othersHr9: number = 0
    othersHr10: number = 0
    othersHr11: number = 0
    othersHr12: number = 0
    othersHr13: number = 0
    othersHr14: number = 0
    othersHr15: number = 0
    othersHr16: number = 0
    othersHr17: number = 0
    othersHr18: number = 0
    othersHr19: number = 0
    othersHr20: number = 0
    othersHr21: number = 0

    arrayManHr: number[]
    arrayWomanHr: number[]
    arrayOthersHr: number[]
    //public contentLoaded: boolean = false
    @Output() contentLoaded = new EventEmitter<boolean>()
    constructor(private accessService: AccessService) {}

    ngOnInit() {
        this.nAcessoHj()
        const categoriesDate = new Date()
        setTimeout(
            () => (
                this.contentLoaded.emit(true),
                (this.chartOptions = {
                    series: [
                        {
                            name: 'Homem',
                            data: this.arrayManHr,
                        },
                        {
                            name: 'Mulher',
                            data: this.arrayWomanHr,
                        },
                        {
                            name: 'Outros',
                            data: this.arrayOthersHr,
                        },
                    ],
                    chart: {
                        height: 350,
                        type: 'area'
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        curve: 'smooth',
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: [
                            categoriesDate.setUTCHours(5),
                            categoriesDate.setUTCHours(6),
                            categoriesDate.setUTCHours(7),
                            categoriesDate.setUTCHours(8),
                            categoriesDate.setUTCHours(9),
                            categoriesDate.setUTCHours(10),
                            categoriesDate.setUTCHours(11),
                            categoriesDate.setUTCHours(12),
                            categoriesDate.setUTCHours(13),
                            categoriesDate.setUTCHours(14),
                            categoriesDate.setUTCHours(15),
                            categoriesDate.setUTCHours(16),
                            categoriesDate.setUTCHours(17),
                            categoriesDate.setUTCHours(18),
                            categoriesDate.setUTCHours(19),
                            categoriesDate.setUTCHours(20),
                            categoriesDate.setUTCHours(21),
                        ],
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm',
                        },
                    },
                })
            ),
            3000
        )
    }

    public generateData(baseval, count, yrange) {
        var i = 0
        var series = []
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
                yrange.min
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

            series.push([x, y, z])
            baseval += 86400000
            i++
        }
        return series
    }
    nAcessoHj() {
        let value = false
        this.contentLoaded.emit(value)
        this.accessService.index().subscribe((res) => {
            this.access = res.access
            let hr = [
                5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            ]
            let diaHj = new Date()
            let accessData
            let dataHj =
                diaHj.getUTCFullYear() +
                '/' +
                (diaHj.getMonth() + 1) +
                '/' +
                diaHj.getUTCDate()

            for (let index = 0; index < this.access.length; index++) {
                accessData =
                    new Date(this.access[index].createdAt).getUTCFullYear() +
                    '/' +
                    (new Date(this.access[index].createdAt).getMonth() + 1) +
                    '/' +
                    new Date(this.access[index].createdAt).getUTCDate()
                if (dataHj === accessData && this.access[index].status) {
                    if (this.access[index].client.genre === 'M') {
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[0]
                        ) {
                            this.manHr5++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[1]
                        ) {
                            this.manHr6++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[2]
                        ) {
                            this.manHr7++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[3]
                        ) {
                            this.manHr8++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[4]
                        ) {
                            this.manHr9++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[5]
                        ) {
                            this.manHr10++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[6]
                        ) {
                            this.manHr11++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[7]
                        ) {
                            this.manHr12++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[8]
                        ) {
                            this.manHr13++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[9]
                        ) {
                            this.manHr14++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[10]
                        ) {
                            this.manHr15++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[11]
                        ) {
                            this.manHr16++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[12]
                        ) {
                            this.manHr17++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[13]
                        ) {
                            this.manHr18++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[14]
                        ) {
                            this.manHr19++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[15]
                        ) {
                            this.manHr20++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[16]
                        ) {
                            this.manHr21++
                        }
                    }
                    if (this.access[index].client.genre === 'F') {
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[0]
                        ) {
                            this.womanHr5++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[1]
                        ) {
                            this.womanHr6++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[2]
                        ) {
                            this.womanHr7++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[3]
                        ) {
                            this.womanHr8++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[4]
                        ) {
                            this.womanHr9++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[5]
                        ) {
                            this.womanHr10++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[6]
                        ) {
                            this.womanHr11++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[7]
                        ) {
                            this.womanHr12++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[8]
                        ) {
                            this.womanHr13++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[9]
                        ) {
                            this.womanHr14++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[10]
                        ) {
                            this.womanHr15++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[11]
                        ) {
                            this.womanHr16++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[12]
                        ) {
                            this.womanHr17++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[13]
                        ) {
                            this.womanHr18++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[14]
                        ) {
                            this.womanHr19++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[15]
                        ) {
                            this.womanHr20++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[16]
                        ) {
                            this.womanHr21++
                        }
                    }
                    if (this.access[index].client.genre === 'Outros') {
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[0]
                        ) {
                            this.othersHr5++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[1]
                        ) {
                            this.othersHr6++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[2]
                        ) {
                            this.othersHr7++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[3]
                        ) {
                            this.othersHr8++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[4]
                        ) {
                            this.othersHr9++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[5]
                        ) {
                            this.othersHr10++

                            console.log(
                                new Date(
                                    this.access[index].createdAt
                                ).getUTCHours()
                            )
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[6]
                        ) {
                            this.othersHr11++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[7]
                        ) {
                            this.othersHr12++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[8]
                        ) {
                            this.othersHr13++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[9]
                        ) {
                            this.othersHr14++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[10]
                        ) {
                            this.othersHr15++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[11]
                        ) {
                            this.othersHr16++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[12]
                        ) {
                            this.othersHr17++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[13]
                        ) {
                            this.othersHr18++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[14]
                        ) {
                            this.othersHr19++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[15]
                        ) {
                            this.othersHr20++
                        }
                        if (
                            new Date(
                                this.access[index].createdAt
                            ).getUTCHours() -
                                1 ===
                            hr[16]
                        ) {
                            this.othersHr21++
                        }
                    }
                }
            }

            this.arrayManHr = [
                this.manHr5,
                this.manHr6,
                this.manHr7,
                this.manHr8,
                this.manHr9,
                this.manHr10,
                this.manHr11,
                this.manHr12,
                this.manHr13,
                this.manHr14,
                this.manHr15,
                this.manHr16,
                this.manHr17,
                this.manHr18,
                this.manHr19,
                this.manHr20,
                this.manHr21,
            ]
            this.arrayWomanHr = [
                this.womanHr5,
                this.womanHr6,
                this.womanHr7,
                this.womanHr8,
                this.womanHr9,
                this.womanHr10,
                this.womanHr11,
                this.womanHr12,
                this.womanHr13,
                this.womanHr14,
                this.womanHr15,
                this.womanHr16,
                this.womanHr17,
                this.womanHr18,
                this.womanHr19,
                this.womanHr20,
                this.womanHr21,
            ]
            this.arrayOthersHr = [
                this.othersHr5,
                this.othersHr6,
                this.othersHr7,
                this.othersHr8,
                this.othersHr9,
                this.othersHr10,
                this.othersHr11,
                this.othersHr12,
                this.othersHr13,
                this.othersHr14,
                this.othersHr15,
                this.othersHr16,
                this.othersHr17,
                this.othersHr18,
                this.othersHr19,
                this.othersHr20,
                this.othersHr21,
            ]
        })
    }
}
