import { IQueryParams } from './../../../interface/i-query-params';
import { ProductsService } from './../../../services/products.service';
import { EditSubcategoriesComponent } from './edit-subcategories/edit-subcategories.component';
import { NewSubcategoriesComponent } from './new-subcategories/new-subcategories.component';
import { SubcategoriesService } from './../../../services/subcategories.service';
import { alerts } from './../../../helpers/alerts';
import { Isubcategories } from './../../../interface/isubcategories';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
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
    public dialog: MatDialog
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

  //Tomar la data de subcategorias
  public getData(): void {
    this.loadData = true;
    this.subcategoriesService.getData().subscribe((resp: any): any => {
      let position = Object.keys(resp).length;
      this.subcategories = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position--,
            category: resp[a].category,
            name: resp[a].name,
            products_inventory: resp[a].products_inventory,
            title_list: resp[a].title_list,
            url: resp[a].url,
            view: resp[a].view,
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
          let params: IQueryParams = {
            orderBy: '"sub_category"',
            equalTo: `"${url}"`,
          };

          this.productsService.getData(params).subscribe((resp: any) => {
            if (Object.keys(resp).length > 0) {
              alerts.basicAlert(
                'Error',
                'La subcategoria tiene productos relacionados',
                'error'
              );
            } else {
              //Eliminar el registro
              this.subcategoriesService
                .deleteData(id)
                .subscribe((resp: any) => {
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
}
