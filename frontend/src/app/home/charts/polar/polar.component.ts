import { Component, OnInit, ViewChild } from '@angular/core'
import { ChartComponent } from 'ng-apexcharts'

import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexStroke,
    ApexFill,
} from 'ng-apexcharts'
import { AccessService } from 'src/app/_services/access/access.service'

export type ChartOptions = {
    series: ApexNonAxisChartSeries
    chart: ApexChart
    responsive: ApexResponsive[]
    labels: any
    stroke: ApexStroke
    fill: ApexFill
}
interface Access {
    id: number
    status: Boolean
    client: {
        genre: string
        birthday: Date
    }
    createdAt: Date
}

@Component({
    selector: 'app-polar',
    templateUrl: './polar.component.html',
    styleUrls: ['./polar.component.css'],
})
export class PolarComponent implements OnInit {
    age15_24: number = 0
    age25_34: number = 0
    age35_44: number = 0
    age45_54: number = 0
    age55_64: number = 0
    age65_75: number = 0
    othersAge: number = 0

    access: Access[]
    accessesByAgeGroup: number[]
    public chartOptions: Partial<ChartOptions>
    constructor(private accessService: AccessService) {}

    ngOnInit() {
        this.accessByAgeGroup()
        setTimeout(
            () =>
                (this.chartOptions = {
                    series: this.accessesByAgeGroup,
                    chart: {
                        type: 'polarArea',
                    },
                    stroke: {
                        colors: ['#fff'],
                    },
                    fill: {
                        opacity: 0.8,
                    },
                    labels: [
                        '15-24',
                        '25-34',
                        '35-44',
                        '45-54',
                        '55-64',
                        '65-75',
                        'others',
                    ],
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
                }),
            3000
        )
    }

    accessByAgeGroup() {
        this.accessService.index().subscribe((res) => {
            this.access = res.access

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
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 15 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 24
                    ) {
                        this.age15_24++
                    }
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 25 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 34
                    ) {
                        this.age25_34++
                    }
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 35 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 44
                    ) {
                        this.age35_44++
                    }
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 45 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 54
                    ) {
                        this.age45_54++
                    }
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 55 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 64
                    ) {
                        this.age55_64++
                    }
                    if (
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) >= 65 &&
                        this.ageCalculator(
                            this.access[index].client.birthday
                        ) <= 75
                    ) {
                        this.age65_75++
                    }
                    if (
                        this.ageCalculator(this.access[index].client.birthday) <
                            15 ||
                        this.ageCalculator(this.access[index].client.birthday) >
                            75
                    ) {
                        this.othersAge++
                        console.log(this.othersAge)
                    }
                }
            }
            this.accessesByAgeGroup = [
                this.age15_24,
                this.age25_34,
                this.age35_44,
                this.age45_54,
                this.age55_64,
                this.age65_75,
                this.othersAge,
            ]
        })
    }
    ageCalculator(birthday): number {
        let showAge
        if (birthday) {
            const convertAge = new Date(birthday)
            const timeDiff = Math.abs(Date.now() - convertAge.getTime())
            showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365)
        }
        return showAge
    }
}
