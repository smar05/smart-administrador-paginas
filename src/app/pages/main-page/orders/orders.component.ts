import { CountService } from './../../../services/count.service';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from './../../../services/orders.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Iorders } from './../../../interface/iorders';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';

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
    private countService: CountService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.loadData = true;

    this.ordersService.getData().subscribe((resp: any) => {
      // Se ajusta la respuesta de la bd a la interfaz
      let position: number = 1;

      this.orders = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position++,
            address: resp[a].address,
            category: resp[a].category,
            city: resp[a].city,
            country: resp[a].country,
            details: resp[a].details,
            email: resp[a].email,
            image: resp[a].image,
            info: resp[a].info,
            phone: resp[a].phone,
            price: resp[a].price,
            process: JSON.parse(resp[a].process),
            product: resp[a].product,
            quantity: resp[a].quantity,
            status: resp[a].status,
            url: resp[a].url,
            user: resp[a].user,
          } as Iorders)
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
}
