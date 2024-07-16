import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { CountService } from './../../../services/count.service';
import { ProductsService } from './../../../services/products.service';
import { EditSubcategoriesComponent } from './edit-subcategories/edit-subcategories.component';
import { NewSubcategoriesComponent } from './new-subcategories/new-subcategories.component';
import { SubcategoriesService } from './../../../services/subcategories.service';
import { alerts } from './../../../helpers/alerts';
import { Isubcategories } from './../../../interface/isubcategories';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css'],
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
export class SubcategoriesComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'name', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Isubcategories>; //Instancia la data que aparecera en la tabla
  public subcategories: Isubcategories[] = [];
  public expandedElement!: Isubcategories | null;
  public loadData: boolean = false;
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private subcategoriesService: SubcategoriesService,
    private productsService: ProductsService,
    public dialog: MatDialog,
    private countService: CountService,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getData();

    //Tamaño de la pantalla
    //Pantalla pequeña si es <767
    /*if (functions.screenSize(0, 767)) {
      this.screenSizeSM = true;
    } else {
      this.screenSizeSM = false;
      this.displayedColumns.splice(1, 0, 'displayName');
      this.displayedColumns.splice(2, 0, 'username');
    }*/
  }

  //Tomar la data de subcategorias
  public getData(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.subcategoriesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]): any => {
        let position = Object.keys(resp).length;
        this.subcategories = resp.map(
          (a: IFireStoreRes) =>
            ({
              position: position--,
              ...this.subcategoriesService.formatIFireStoreResp(a),
            } as Isubcategories)
        );
        this.dataSource = new MatTableDataSource(this.subcategories);
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

  //Dialogo para una nueva subcategoria
  public newSubcategory(): void {
    const dialogRef = this.dialog.open(NewSubcategoriesComponent, {
      width: '100%',
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  //Editar subcategoria
  public editSubcategory(id: string): void {
    const dialogRef = this.dialog.open(EditSubcategoriesComponent, {
      width: '100%',
      data: {
        id: id,
      },
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  //Eliminar subcategoria
  public deleteSubcategory(id: string, url: string): any {
    alerts
      .confirmAlert(
        '¿Esta seguro?',
        'La información no podra recuperarse',
        'warning',
        'Si, eliminar'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          let qf: QueryFn = (ref) =>
            ref
              .where(
                'idShop',
                '==',
                localStorage.getItem(EnumLocalStorage.localId)
              )
              .where('sub_category', '==', url)
              .limit(1);

          this.productsService
            .getDataFS(qf)
            .toPromise()
            .then((resp: IFireStoreRes[]) => {
              if (Object.keys(resp).length > 0) {
                alerts.basicAlert(
                  'Error',
                  'La subcategoria tiene productos relacionados',
                  'error'
                );
              } else {
                //Eliminar el registro
                this.subcategoriesService.deleteDataFS(id).then(() => {
                  alerts.basicAlert(
                    'Listo',
                    'La subcategoria ha sido eliminada',
                    'success'
                  );
                  this.getData();
                });
              }
            });
        }
      });
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.subcategories)
      .toPromise()
      .then((res: any) => {});
  }
}
