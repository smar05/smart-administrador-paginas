import { CountService } from './../../../services/count.service';
import { IQueryParams } from './../../../interface/i-query-params';
import { SubcategoriesService } from './../../../services/subcategories.service';
import { alerts } from './../../../helpers/alerts';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { CategoriesService } from './../../../services/categories.service';
import {
  EnumCategorieState,
  Icategories,
} from './../../../interface/icategories';
import { NewCategoriesComponent } from './new-categories/new-categories.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import '../../../shared/spinkit/sk-cube-grid.css';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
    private subcategoriesService: SubcategoriesService,
    public dialog: MatDialog,
    public countService: CountService
  ) {}

  ngOnInit(): void {
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
    this.categoriesService.getData().subscribe((resp: any): any => {
      let position = Object.keys(resp).length;
      this.categories = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position--,
            name: resp[a].name,
            icon: resp[a].icon,
            image: resp[a].image,
            title_list: resp[a].title_list,
            url: resp[a].url,
            view: resp[a].view,
            state: resp[a].state,
          } as Icategories)
      );
      this.dataSource = new MatTableDataSource(this.categories);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.categories.forEach(async (categorie: Icategories) => {
        await this.getCategorieImage(categorie);
      });

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
  public changeState(e: any): void {
    const data = e.target.checked
      ? {
          state: EnumCategorieState.show,
        }
      : {
          state: EnumCategorieState.hidden,
        };
    this.categoriesService
      .patchData(e.target.id.split('_')[1], data)
      .subscribe(() => {
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
      .then((result: any) => {
        if (result.isConfirmed) {
          //Validar que la categoria no tenga una subcategoria
          let params: IQueryParams = {
            orderBy: '"category"',
            equalTo: `"${name}"`,
          };

          this.subcategoriesService
            .getData(params)
            .subscribe(async (resp: any) => {
              if (Object.keys(resp).length > 0) {
                alerts.basicAlert(
                  'Error',
                  'La categoria tiene subcategorias',
                  'error'
                );
              } else {
                //Eliminar imagen de categoria
                try {
                  if (name && id)
                    await this.categoriesService.deleteImages(`${id}/main/`);
                } catch (error) {
                  alerts.basicAlert(
                    'Error',
                    'No se pudo eliminar la imagen de la categoria',
                    'error'
                  );
                  return;
                }

                //Eliminar registro de la base de datos
                this.categoriesService.deleteData(id).subscribe(
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
      });
  }

  public async getCategorieImage(categorie: Icategories): Promise<void> {
    let urlImage: string = '';

    if (categorie.id) {
      urlImage = await this.categoriesService.getImage(`${categorie.id}/main`);
    }

    if (urlImage) {
      this.categoriesImages.set(categorie.id!, urlImage);
    }
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }
}
