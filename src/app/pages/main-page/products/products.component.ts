import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { CountService } from './../../../services/count.service';
import { IQueryParams } from './../../../interface/i-query-params';
import { alerts } from './../../../helpers/alerts';
import { ProductsService } from './../../../services/products.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Iproducts,
  EnumProductImg,
  EnumProductReviewType,
} from './../../../interface/iproducts';
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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
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
export class ProductsComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'name', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Iproducts>; //Instancia la data que aparecera en la tabla
  public products: Iproducts[] = [];
  public expandedElement!: Iproducts | null;
  public loadData: boolean = false;
  public productsImages: Map<string, string> = new Map();
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
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

  //Tomar la data de productos
  public getData(): void {
    this.loadData = true;
    let params: IQueryParams = {
      orderBy: '"delete"',
      equalTo: false,
    };
    this.productsService.getData(params).subscribe((resp: any): any => {
      //Integrar la respuesta del servidor con la interfaz
      let position = Object.keys(resp).length;
      this.products = this.productsService.formatProducts(resp);

      //Imagenes de los productos
      this.products.forEach(async (product: Iproducts) => {
        await this.getProductMainImage(product, EnumProductImg.main); //Imagen principal
        /*
        await this.getProductMainImage(product, EnumProductImg.default_banner);
        await this.getProductMainImage(
          product,
          EnumProductImg.horizontal_slider
        );
        await this.getProductMainImage(product, EnumProductImg.top_banner);
        await this.getProductMainImage(product, EnumProductImg.vertical_slider);
        */
      });

      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadData = false;

      //Configuracion de las reseñas
      for (const i in this.products) {
        this.configReviews(this.products[i].reviews, i);
      }
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

  //Eliminar producto
  public deleteProduct(id: string): void {
    let product: Iproducts | undefined = this.products.find(
      (producto: Iproducts) => producto.id == id
    );

    alerts
      .confirmAlert(
        '¿Esta seguro?',
        'La información no podra recuperarse',
        'warning',
        'Si, eliminar'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          if (product) {
            this.productsService
              .patchData(id, { delete: true })
              .toPromise()
              .then((res: any) => {
                this.products = this.products.filter(
                  (producto: Iproducts) => producto.id != id
                );

                this.dataSource = new MatTableDataSource(this.products);
              })
              .catch((err: any) => {
                alerts.basicAlert(
                  'Error',
                  'No se pudo eliminar el producto',
                  'error'
                );
              });
          }
        }
      });
  }

  //Funcion para promediar las reseñas
  public configReviews(data: any, index: any): void {
    let arrayReviews = [];

    if (data.length > 0) {
      let totalReview = 0;
      let promReview = 0;

      for (const i in data) {
        totalReview += Number(data[i].review);
      }

      promReview = Math.round(totalReview / data.length);

      for (let i = 1; i <= 5; i++) {
        if (i > promReview) {
          arrayReviews[i - 1] = 2;
        } else {
          arrayReviews[i - 1] = 1;
        }
      }

      this.products[index].reviews = arrayReviews;
    }
  }

  //Cambia el estado del producto
  public cambiarEstado(producto: any, estado: string): void {
    let feedback = producto.feedback;
    if (estado === EnumProductReviewType.approved) {
      //Desactivar el estado
      alerts
        .confirmAlert(
          '¿Esta seguro de cambiar el estado del producto?',
          'Desea desactivar el producto',
          'question',
          'Si'
        )
        .then((result: any) => {
          if (result.isConfirmed) {
            feedback.type = EnumProductReviewType.review;
            let data = {
              feedback: JSON.stringify(feedback),
            };
            this.productsService.patchData(producto.id, data).subscribe(
              (resp) => {
                this.getData();
                alerts.basicAlert(
                  'Listo',
                  'Se ha cambiado el estado del producto',
                  'success'
                );
              },
              (error) => {
                alerts.basicAlert(
                  'Error',
                  'No se ha podido cambiar el estado del producto',
                  'error'
                );
              }
            );
          }
        });
    } else if (estado === EnumProductReviewType.review) {
      //Activar el estado
      alerts
        .confirmAlert(
          '¿Esta seguro de cambiar el estado del producto?',
          'Desea activar el producto',
          'question',
          'Si'
        )
        .then((result: any) => {
          if (result.isConfirmed) {
            feedback.type = EnumProductReviewType.approved;
            let data = {
              feedback: JSON.stringify(feedback),
            };
            this.productsService.patchData(producto.id, data).subscribe(
              (resp) => {
                this.getData();
                alerts.basicAlert(
                  'Listo',
                  'Se ha cambiado el estado del producto',
                  'success'
                );
              },
              (err) => {
                alerts.basicAlert(
                  'Error',
                  'No se ha podido cambiar el estado del producto',
                  'error'
                );
              }
            );
          }
        });
    }
  }

  public async getProductMainImage(
    product: Iproducts,
    type: string
  ): Promise<void> {
    let urlImage: string = '';

    if (product.id) {
      let url: string = type ? `${product.id}/${type}` : '';
      let set: string = type ? `${product.id}-${type}` : '';

      if (url) urlImage = await this.productsService.getImage(url);

      if (urlImage) {
        this.productsImages.set(set, urlImage);
      } else {
        this.productsImages.set(set, '');
      }
    }
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.products)
      .subscribe((res: any) => {});
  }
}
