import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { CountService } from './../../../services/count.service';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { OrdersService } from './../../../services/orders.service';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { Iorders } from './../../../interface/iorders';
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
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
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
export class OrdersComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'status',
    'product',
    'quantity',
    'id',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Iorders>; //Instancia la data que aparecera en la tabla
  public orders: Iorders[] = [];
  public expandedElement!: Iorders | null;
  public loadData: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private countService: CountService,
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

    this.ordersService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        // Se ajusta la respuesta de la bd a la interfaz
        let position: number = 1;

        this.orders = resp.map((a: IFireStoreRes) => {
          return {
            id: a.id,
            position: position++,
            address: a.data.address,
            category: a.data.category,
            city: a.data.city,
            country: a.data.country,
            details: a.data.details,
            email: a.data.email,
            image: a.data.image,
            info: a.data.info,
            phone: a.data.phone,
            price: a.data.price,
            process: JSON.parse(a.data.process),
            product: a.data.product,
            quantity: a.data.quantity,
            status: a.data.status,
            url: a.data.url,
            user: a.data.user,
            idShop: a.data.idShop,
          };
        });

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

  // Funcion para llamar el dialogo de edicion de order
  public editOrder(id: string): void {
    const dialogRef = this.dialog.open(EditOrdersComponent, {
      width: '100%',
      data: {
        id: id,
      },
    });

    // Actualizar el listado de las tablas
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.orders)
      .toPromise()
      .then((res: any) => {});
  }
}
