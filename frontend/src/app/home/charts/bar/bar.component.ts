import { Component, OnInit } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
} from "ng-apexcharts";
import { AccessService } from "src/app/_services/access/access.service";

interface Access {
    id: number;
    status: Boolean;
    client: {
        genre: string;
    };
    createdAt: Date;
}
export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};
@Component({
    selector: "app-bar",
    templateUrl: "./bar.component.html",
    styleUrls: ["./bar.component.css"],
})
export class BarComponent implements OnInit {
    access: Access[];
    manJan: number = 0;
    manFeb: number = 0;
    manMar: number = 0;
    manApr: number = 0;
    manMay: number = 0;
    manJun: number = 0;
    manJul: number = 0;
    manAug: number = 0;
    manSep: number = 0;
    manOct: number = 0;
    manNov: number = 0;
    manDec: number = 0;

    womanJan: number = 0;
    womanFeb: number = 0;
    womanMar: number = 0;
    womanApr: number = 0;
    womanMay: number = 0;
    womanJun: number = 0;
    womanJul: number = 0;
    womanAug: number = 0;
    womanSep: number = 0;
    womanOct: number = 0;
    womanNov: number = 0;
    womanDec: number = 0;

    othersJan: number = 0;
    othersFeb: number = 0;
    othersMar: number = 0;
    othersApr: number = 0;
    othersMay: number = 0;
    othersJun: number = 0;
    othersJul: number = 0;
    othersAug: number = 0;
    othersSep: number = 0;
    othersOct: number = 0;
    othersNov: number = 0;
    othersDec: number = 0;

    arrayManMes: number[];
    arrayWomanMes: number[];
    arrayOthersMes: number[];
    public chartOptions: Partial<ChartOptions>;
    constructor(private accessService: AccessService) { }

    ngOnInit() {
        this.nAcessoPorMes();
        setTimeout(
            () =>
            (this.chartOptions = {
                series: [
                    {
                        name: "Homen",
                        data: this.arrayManMes,
                    },
                    {
                        name: "Mulher",
                        data: this.arrayWomanMes,
                    },
                    {
                        name: "Outros",
                        data: this.arrayOthersMes,
                    },
                ],
                chart: {
                    type: "bar",
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        //endingShape: 'rounded',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ],
                },
                yaxis: {
                    title: {
                        //text: 'Acessos',
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " Acessos";
                        },
                    },
                },
            }),
            3000
        );
    }

    nAcessoPorMes() {
        this.accessService.index().subscribe((res) => {
            this.access = res.access;
            let mes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let data = new Date();
            let currenteAnoAccess;
            let currenteAno = data.getUTCFullYear();

            for (let index = 0; index < this.access.length; index++) {
                currenteAnoAccess = new Date(
                    this.access[index].createdAt
                ).getUTCFullYear();

                if (currenteAno === currenteAnoAccess && this.access[index].status) {
                    if (this.access[index].client.genre === "M") {
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[0]
                        ) {
                            this.manJan++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[1]
                        ) {
                            this.manFeb++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[2]
                        ) {
                            this.manMar++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[3]
                        ) {
                            this.manApr++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[4]
                        ) {
                            this.manMay++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[5]
                        ) {
                            this.manJun++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[6]
                        ) {
                            this.manJul++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[7]
                        ) {
                            this.manAug++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[8]
                        ) {
                            this.manSep++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[9]
                        ) {
                            this.manOct++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[10]
                        ) {
                            this.manNov++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[11]
                        ) {
                            this.manDec++;
                        }
                    }
                    if (this.access[index].client.genre === "F") {
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[0]
                        ) {
                            this.womanJan++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[1]
                        ) {
                            this.womanFeb++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[2]
                        ) {
                            this.womanMar++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[3]
                        ) {
                            this.womanApr++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[4]
                        ) {
                            this.womanMay++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[5]
                        ) {
                            this.womanJun++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[6]
                        ) {
                            this.womanJul++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[7]
                        ) {
                            this.womanAug++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[8]
                        ) {
                            this.womanSep++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[9]
                        ) {
                            this.womanOct++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[10]
                        ) {
                            this.womanNov++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[11]
                        ) {
                            this.womanDec++;
                        }
                    }
                    if (this.access[index].client.genre === "Outros" || this.access[index].client.genre === '') {
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[0]
                        ) {
                            this.othersJan++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[1]
                        ) {
                            this.othersFeb++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[2]
                        ) {
                            this.othersMar++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[3]
                        ) {
                            this.othersApr++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[4]
                        ) {
                            this.othersMay++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[5]
                        ) {
                            this.othersJun++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[6]
                        ) {
                            this.othersJul++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[7]
                        ) {
                            this.othersAug++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[8]
                        ) {
                            this.othersOct++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[9]
                        ) {
                            this.othersOct++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[10]
                        ) {
                            this.othersNov++;
                        }
                        if (
                            new Date(this.access[index].createdAt).getMonth() + 1 ===
                            mes[11]
                        ) {
                            this.othersDec++;
                        }
                    }
                }
            }
            this.arrayManMes = [
                this.manJan,
                this.manFeb,
                this.manMar,
                this.manApr,
                this.manMay,
                this.manJun,
                this.manJul,
                this.manAug,
                this.manSep,
                this.manOct,
                this.manNov,
                this.manDec,
            ];
            this.arrayWomanMes = [
                this.womanJan,
                this.womanFeb,
                this.womanMar,
                this.womanApr,
                this.womanMay,
                this.womanJun,
                this.womanJul,
                this.womanAug,
                this.womanSep,
                this.womanOct,
                this.womanNov,
                this.womanDec,
            ];
            this.arrayOthersMes = [
                this.othersJan,
                this.othersFeb,
                this.othersMar,
                this.othersApr,
                this.othersMay,
                this.othersJun,
                this.othersJul,
                this.othersAug,
                this.othersSep,
                this.othersOct,
                this.othersNov,
                this.othersDec,
            ];
        });
    }
}
