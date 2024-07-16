import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { SalesService } from './../../../services/sales.service';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { Isales } from './../../../interface/isales';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed,void',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SalesComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'id_order',
    'unit_price',
    'commission',
    'total',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Isales>; //Instancia la data que aparecera en la tabla
  public orders: Isales[] = [];
  public expandedElement!: Isales | null;
  public loadData: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private salesService: SalesService,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getData();
  }

  public getData(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.salesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        // Se ajusta la respuesta de la bd a la interfaz
        let position: number = 1;

        this.orders = resp.map(
          (a: IFireStoreRes) =>
            ({
              id: a.id,
              position: position++,
              client: a.data.client,
              date: a.data.date,
              id_order: a.data.id_order,
              id_payment: a.data.id_payment,
              payment_method: a.data.payment_method,
              product: a.data.product,
              quantity: a.data.quantity,
              status: a.data.status,
              unit_price: a.data.unit_price,
              commission: a.data.commission,
              total: a.data.total,
              url: a.data.url,
              paid_out: a.data.paid_out,
              idShop: a.data.idShop,
            } as Isales)
        );

        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.loadData = false;
      });
  }

  //FIltro de busqueda
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editSale(id: string): void {}

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.sales)
      .toPromise()
      .then((res: any) => {});
  }
}
