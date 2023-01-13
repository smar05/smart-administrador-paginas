import { alerts } from 'src/app/helpers/alerts';
import { EnumSalesStatus } from './../../../interface/isales';
import { functions } from 'src/app/helpers/functions';
import { IQueryParams } from './../../../interface/i-query-params';
import { UsersService } from './../../../services/users.service';
import { SalesService } from './../../../services/sales.service';
import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public itemsQuantity: any = {
    products: 0,
    sales: 0,
    users: 0,
  };
  public loadItems: any = {
    products: false,
    sales: false,
    users: false,
  };
  //Angular Google charts
  public chart: any = {
    title: '',
    type: 'ColumnChart',
    data: [],
    columnNames: ['Fecha', 'Total'],
    options: {
      colors: ['#379656'],
    },
  };
  //Rangos de fechas
  public startDate: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ); // Se trae todo lo del año actual
  public endDate: Date = new Date(); // Fecha de hoy

  public totalSales: number = 0;

  constructor(
    private productsService: ProductsService,
    private salesService: SalesService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getSales();
    this.getUsers();
  }

  public getProducts(): void {
    this.loadItems.products = true;
    this.productsService.getData().subscribe((resp: any) => {
      this.itemsQuantity.products = Object.keys(resp).length;
      this.loadItems.products = false;
    });
  }

  public getSales(): void {
    this.chart.data = [];
    if (!(this.startDate && this.endDate && this.startDate < this.endDate)) {
      if (!(this.startDate < this.endDate)) {
        alerts.basicAlert(
          'Fecha invalida',
          'La fecha inicial debe ser menor a la fecha final',
          'warning'
        );
      }
      return;
    }

    this.loadItems.sales = true;

    let params: IQueryParams = {
      orderBy: '"date"',
      startAt: `"${functions.formatDate(this.startDate)}"`,
      endAt: `"${functions.formatDate(this.endDate)}"`,
    };
    this.salesService.getData(params).subscribe((resp: any) => {
      this.itemsQuantity.sales = Object.keys(resp).length;

      //Separar mes y total
      let sales: any[] = [];
      Object.keys(resp).map((a: any) => {
        if (resp[a].status == EnumSalesStatus.success) {
          sales.push({
            date: resp[a].date.substring(0, 7),
            total: Number(resp[a].total),
          });
        }
      });

      // Sacar total en mes repetido
      let result: any[] = this.groupByDateAndSumTotals(sales);

      // Ordenar de menor a mayor las fechas
      result.sort(function (a, b) {
        let fechaA: any = new Date(a.date);
        let fechaB: any = new Date(b.date);
        return fechaA - fechaB;
      });

      //Agregar el arreglo a la data del grafico
      Object.keys(result).map((a: any, i: number) => {
        const data = [result[a].date, result[a].total];

        this.chart.data[i] = data;
      });

      // Sumar el total de ventas
      this.chart.data.forEach((value: any) => {
        this.totalSales += value[1];
      });

      this.loadItems.sales = false;
    });
  }

  public getUsers(): void {
    this.loadItems.users = true;
    this.usersService.getData().subscribe((resp: any) => {
      this.itemsQuantity.users = Object.keys(resp).length;
      this.loadItems.users = false;
    });
  }

  /**
   * Agrupar por fecha y sumar totales
   *
   * @param {any[]} arr
   * @return {*}  {any[]}
   * @memberof HomeComponent
   */
  public groupByDateAndSumTotals(arr: any[]): any[] {
    // Crear un objeto vacío para almacenar los datos agrupados
    let groupedData: any = {};

    // Iterar sobre cada objeto en el arreglo
    for (let obj of arr) {
      // Si la fecha no existe en el objeto agrupado, crear una nueva entrada con el total inicializado en 0
      if (!groupedData[obj.date]) {
        groupedData[obj.date] = { date: obj.date, total: 0 };
      }
      // Sumar el total del objeto actual al total para la fecha correspondiente en el objeto agrupado
      groupedData[obj.date].total += obj.total;
    }

    // Convertir el objeto agrupado en un arreglo
    let result = Object.values(groupedData);

    // Devolver el arreglo resultante
    return result;
  }

  public changeStartDate(e: any): void {
    let anio: number = e.target.value
      .split('-')
      .map((a: string) => Number(a))[0];
    let mes: number =
      e.target.value.split('-').map((a: string) => Number(a))[1] - 1;
    let dia: number = e.target.value
      .split('-')
      .map((a: string) => Number(a))[2];

    this.startDate = new Date(anio, mes, dia);
    this.getSales();
  }

  public changeEndDate(e: any): void {
    let anio: number = e.target.value
      .split('-')
      .map((a: string) => Number(a))[0];
    let mes: number =
      e.target.value.split('-').map((a: string) => Number(a))[1] - 1;
    let dia: number = e.target.value
      .split('-')
      .map((a: string) => Number(a))[2];

    this.endDate = new Date(anio, mes, dia);
    this.getSales();
  }
}
