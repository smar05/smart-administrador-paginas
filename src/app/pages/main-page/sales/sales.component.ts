import { SalesService } from './../../../services/sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Isales } from './../../../interface/isales';
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

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.loadData = true;

    this.salesService.getData().subscribe((resp: any) => {
      // Se ajusta la respuesta de la bd a la interfaz
      let position: number = 1;

      this.orders = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position++,
            client: resp[a].client,
            date: resp[a].date,
            id_order: resp[a].id_order,
            id_payment: resp[a].id_payment,
            payment_method: resp[a].payment_method,
            product: resp[a].product,
            quantity: resp[a].quantity,
            status: resp[a].status,
            unit_price: resp[a].unit_price,
            commission: resp[a].commission,
            total: resp[a].total,
            url: resp[a].url,
            paid_out: resp[a].paid_out,
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
}
