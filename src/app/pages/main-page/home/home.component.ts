import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { Iproducts, EnumProductImg } from './../../../interface/iproducts';
import { Iorders } from './../../../interface/iorders';
import { OrdersService } from './../../../services/orders.service';
import { alerts } from 'src/app/helpers/alerts';
import { EnumSalesStatus } from './../../../interface/isales';
import { functions } from 'src/app/helpers/functions';
import { IQueryParams } from './../../../interface/i-query-params';
import { UsersService } from './../../../services/users.service';
import { SalesService } from './../../../services/sales.service';
import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

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
  public loadItems = {
    products: false,
    sales: false,
    users: false,
    loadOrders: false,
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
  // Ultimas ordenes
  public latestOrders: any[] = [];
  // Ultimos productos
  public latestProducts: Iproducts[] = [];
  // Imagenes productos
  public imagenesProductos: Map<string, string> = new Map();

  constructor(
    private productsService: ProductsService,
    private salesService: SalesService,
    private usersService: UsersService,
    private ordersService: OrdersService,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getProducts();
    this.getSales();
    this.getUsers();
    this.lastOrders();
  }

  public getProducts(): void {
    this.loadItems.products = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.productsService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        this.itemsQuantity.products = Object.keys(resp).length;

        let products: Iproducts[] = this.productsService.formatProducts(
          resp.map((a: IFireStoreRes) => {
            return {
              id: a.id,
              ...a.data,
            };
          })
        );

        products.sort((a: Iproducts, b: Iproducts) => {
          if (a.date_created > b.date_created) return 1;
          if (a.date_created < b.date_created) return -1;

          return 0;
        });

        this.latestProducts = products.slice(
          this.itemsQuantity.products - 5,
          this.itemsQuantity.products
        );

        this.latestProducts.forEach(async (product: Iproducts) => {
          let urlImagen: string = await this.productsService.getImage(
            `${product.id}/${EnumProductImg.main}`
          );
          if (product.id) this.imagenesProductos.set(product.id, urlImagen);
        });

        this.loadItems.products = false;
      });
  }

  public getSales(): void {
    this.chart.data = [];
    this.totalSales = 0;
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

    const start = new Date(functions.formatDate(this.startDate));
    const end = new Date(functions.formatDate(this.endDate));
    end.setDate(this.endDate.getDate() + 1);

    let qf: QueryFn = (ref) =>
      ref
        .where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId))
        .where('date', '>=', start)
        .where('date', '<=', end);

    this.salesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        this.itemsQuantity.sales = Object.keys(resp).length;
        this.loadItems.sales = false;

        //Separar mes y total
        let sales: any[] = [];
        resp.map((a: IFireStoreRes) => {
          if (a.data.status == EnumSalesStatus.success) {
            sales.push({
              date: new Date(a.data.date.seconds * 1000)
                .toISOString()
                .substring(0, 7),
              total: Number(a.data.total),
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
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.usersService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
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

  public lastOrders(): void {
    this.loadItems.loadOrders = true;
    // Se traen las ultimas 5 ventas
    let qf: QueryFn = (ref) =>
      ref
        .where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId))
        .orderBy('date')
        .limitToLast(5);

    this.salesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        if (resp?.length <= 0) this.loadItems.loadOrders = false;

        resp.map((a: IFireStoreRes, i: number) => {
          this.latestOrders[i] = {};

          // Se tran las ultimas 5 ordenes
          this.ordersService
            .getItemFS(a.data.id_order)
            .toPromise()
            .then((resp2: IFireStoreRes) => {
              this.latestOrders[i] = {
                id: a.id,
                product: resp2.data.product,
                status: resp2.data.status,
                date: new Date(a.data.date.seconds * 1000),
              };

              this.loadItems.loadOrders = false;
            });
        });
      });
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage('home')
      .toPromise()
      .then((res: any) => {});
  }
}
