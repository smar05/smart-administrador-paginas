import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { CountService } from './../../../services/count.service';
import { NavbarComponent } from './../../../shared/navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
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
import { EditDisputesComponent } from './edit-disputes/edit-disputes.component';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  providers: [NavbarComponent],
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
  public disputes: Idisputes[] = [];
  public expandedElement!: Idisputes | null;
  public loadData: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private disputesService: DisputesService,
    private dialog: MatDialog,
    private navbarComponent: NavbarComponent,
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

    this.disputesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        // Se ajusta la respuesta de la bd a la interfaz
        this.disputes = this.disputesService.formatDisputes(
          resp.map((a: IFireStoreRes) => {
            return {
              id: a.id,
              ...a.data,
            };
          })
        );

        this.dataSource = new MatTableDataSource(this.disputes);
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

  public editDispute(id: string): void {
    const dialogRef = this.dialog.open(EditDisputesComponent, {
      width: '100%',
      data: {
        id,
      },
    });

    //Actualizar el listado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
        //Se actualiza el icono del navbar
        this.navbarComponent.getDisputes();
      }
    });
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.disputes)
      .toPromise()
      .then((res: any) => {});
  }
}
