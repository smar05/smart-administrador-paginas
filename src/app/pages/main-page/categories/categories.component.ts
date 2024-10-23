import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { CountService } from './../../../services/count.service';
import { alerts } from './../../../helpers/alerts';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { CategoriesService } from './../../../services/categories.service';
import {
  EnumCategorieImg,
  EnumCategorieState,
  Icategories,
} from './../../../interface/icategories';
import { NewCategoriesComponent } from './new-categories/new-categories.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
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
export class CategoriesComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'name', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Icategories>; //Instancia la data que aparecera en la tabla
  public categories: Icategories[] = [];
  public expandedElement!: Icategories | null;
  public loadData: boolean = false;
  public categoriesImages: Map<string, string> = new Map();
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriesService: CategoriesService,
    public dialog: MatDialog,
    public countService: CountService,
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

  //Tomar la data de categorias
  public getData(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));
    this.categoriesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]): any => {
        let position = Object.keys(resp).length;
        this.categories = resp.map((a: IFireStoreRes) => {
          return {
            position: position--,
            ...this.categoriesService.formatIFireStoreRes(a),
          };
        }) as Icategories[];
        this.dataSource = new MatTableDataSource(this.categories);
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

  //Dialogo para una nueva categoria
  public newCategory(): void {
    const dialogRef = this.dialog.open(NewCategoriesComponent, {
      width: '100%',
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  //Cambiar estado de la categoria
  public changeState(e: any, id: string): void {
    let state: string = e.target.checked
      ? EnumCategorieState.show
      : EnumCategorieState.hidden;

    let categorie: Icategories | any = this.categories.find(
      (c: Icategories) => c.id == id
    );
    categorie.state = state;
    delete categorie.position;
    delete categorie.id;

    this.categoriesService
      .patchDataFS(e.target.id.split('_')[1], categorie)
      .then(() => {
        this.getData();
      });
  }

  //Editar categoria
  public editCategorie(id: string): void {
    const dialogRef = this.dialog.open(EditCategoriesComponent, {
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

  //Eliminar categoria
  public deleteCategorie(id: string, name: string) {
    alerts
      .confirmAlert(
        '¿Esta seguro?',
        'La información no podra recuperarse',
        'warning',
        'Si, eliminar'
      )
      .then(async (result: any) => {
        if (result.isConfirmed) {
          //Eliminar registro de la base de datos
          this.categoriesService.deleteDataFS(id).then(
            (resp: any) => {
              alerts.basicAlert(
                'Listo',
                'La categoria ha sido eliminada',
                'success'
              );
              this.getData();
            },
            (err) => {
              alerts.basicAlert(
                'Error',
                'No se ha podido eliminar la categoria',
                'error'
              );
            }
          );
        }
      });
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.categories)
      .toPromise()
      .then((res: any) => {});
  }
}
