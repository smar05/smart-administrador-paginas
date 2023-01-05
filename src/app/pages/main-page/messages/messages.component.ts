import { EditMessagesComponent } from './edit-messages/edit-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from './../../../services/message.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Imessages } from './../../../interface/imessages';
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
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
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
export class MessagesComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'url_product',
    'transmitter',
    'receiver',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Imessages>; //Instancia la data que aparecera en la tabla
  public orders: Imessages[] = [];
  public expandedElement!: Imessages | null;
  public loadData: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.loadData = true;

    this.messageService.getData().subscribe((resp: any) => {
      // Se ajusta la respuesta de la bd a la interfaz
      let position: number = 1;

      this.orders = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position++,
            answer: resp[a].answer,
            date_answer: resp[a].date_answer,
            date_message: resp[a].date_message,
            message: resp[a].message,
            url_product: resp[a].url_product,
            receiver: resp[a].receiver,
            transmitter: resp[a].transmitter,
          } as Imessages)
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

  public editMessage(id: string): void {
    const dialogRef = this.dialog.open(EditMessagesComponent, {
      width: '100%',
      data: {
        id,
      },
    });

    //Actualizar el listado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }
}
