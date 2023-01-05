import { DisputesService } from './../../../services/disputes.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Idisputes } from './../../../interface/idisputes';
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
  selector: 'app-disputes',
  templateUrl: './disputes.component.html',
  styleUrls: ['./disputes.component.css'],
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
export class DisputesComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'order',
    'transmitter',
    'receiver',
    'message',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Idisputes>; //Instancia la data que aparecera en la tabla
  public orders: Idisputes[] = [];
  public expandedElement!: Idisputes | null;
  public loadData: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private disputesService: DisputesService) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.loadData = true;

    this.disputesService.getData().subscribe((resp: any) => {
      // Se ajusta la respuesta de la bd a la interfaz
      let position: number = 1;

      this.orders = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position++,
            answer: resp[a].answer,
            date_answer: resp[a].date_answer,
            date_dispute: resp[a].date_dispute,
            message: resp[a].message,
            order: resp[a].order,
            receiver: resp[a].receiver,
            transmitter: resp[a].transmitter,
          } as Idisputes)
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

  public editDispute(id: string): void {}
}
