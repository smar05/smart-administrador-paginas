import { alerts } from './../../../../helpers/alerts';
import { Isubcategories } from './../../../../interface/isubcategories';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import { Icategories } from './../../../../interface/icategories';
import { CategoriesService } from './../../../../services/categories.service';
import { Iproducts } from './../../../../interface/iproducts';
import { ProductsService } from './../../../../services/products.service';
import { functions } from './../../../../helpers/functions';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import '../../../../shared/spinkit/sk-cube-grid.css';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  //Grupo de controles
  public f = this.form.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]{1,50}/),
        ],
        asyncValidators: [this.isRepeatProduct()],
        updateOn: 'blur',
      },
    ],
    category: ['', [Validators.required]],
    sub_category: ['', [Validators.required]],
    image: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get category() {
    return this.f.controls.category;
  }

  get sub_category() {
    return this.f.controls.sub_category;
  }

  get image() {
    return this.f.controls.image;
  }

  get description() {
    return this.f.controls.description;
  }

  //Variable para validar el envio del formulario
  public formSubmitted: boolean = false;

  //Variable de precarga
  public loadData: boolean = false;

  //Variable global de la url
  public urlInput: string = '';

  //Variable con las categorias
  public categories: any[] = [];

  //Variable con las subcategorias
  public subcategories: any[] = [];

  //Variable para el listado de titulo
  public titleList: string = '';

  //Variable para la imagen del producto
  public imgTemp: string = '';

  //Galeria de imagenes del producto
  public files: File[] = [];

  //Configuracion summernote
  config = {
    placeholder: '',
    tabsize: 2,
    height: 400,
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'hr']],
    ],
    fontNames: [
      'Helvetica',
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Courier New',
      'Roboto',
      'Times',
    ],
  };

  constructor(
    private form: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService
  ) {}

  ngOnInit(): void {
    //Categorias
    this.categoriesService.getData().subscribe((resp: any) => {
      this.categories = Object.keys(resp).map((a) => ({
        name: resp[a].name,
        titleList: JSON.parse(resp[a].title_list),
        url: resp[a].url,
      }));
    });
  }

  //Guardar producto
  public async saveProduct(): Promise<void> {
    this.formSubmitted = true;

    //Validamos que el formulario este correcto
    if (this.f.invalid || this.files.length > 4) {
      alerts.basicAlert(
        'Error',
        'Se encontro un error en el formulario',
        'error'
      );
      return;
    }
    this.loadData = true;

    //Galeria de fotos del producto
    let galleryPhotos: string[] = [];
    if (this.files.length > 0) {
      let photo64: string = ''; //Foto en base 64
      for (const file of this.files) {
        try {
          photo64 = await functions.fileToBase64(file);
          galleryPhotos.push(photo64);
        } catch (error) {
          console.error(error);
        }
      }
    }

    //Informacion del formulario en la interfaz
    const dataProduct: Iproducts = {
      category: this.f.controls.category.value.split('_')[0],
      date_created: '',
      default_banner: '',
      delivery_time: 0,
      description: this.f.controls.description.value,
      details: '',
      feedback: '',
      gallery: JSON.stringify(galleryPhotos),
      horizontal_slider: '',
      image: this.imgTemp,
      name: this.f.controls.name.value,
      offer: '',
      price: '',
      reviews: '',
      sales: 0,
      shipping: '',
      specification: '',
      stock: 0,
      store: '',
      sub_category: this.f.controls.sub_category.value.split('_')[0],
      summary: '',
      tags: '',
      title_list: this.titleList,
      top_banner: '',
      url: this.urlInput,
      vertical_slider: '',
      video: '',
      views: 0,
    };
    console.log(dataProduct);
  }

  //Validamos el formulario
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }

  //Validar que el nombre del producto no se repita
  public isRepeatProduct(): any {
    return (control: AbstractControl) => {
      const name = functions.createUrl(control.value);
      return new Promise((resolve) => {
        this.productsService.getFilterData('url', name).subscribe((resp) => {
          if (Object.keys(resp).length > 0) {
            resolve({ product: true });
            this.urlInput = '';
          } else {
            resolve(null);
            this.urlInput = name;
          }
        });
      });
    };
  }

  //Filtro de subcategorias
  public selectCategory(e: any): void {
    this.categories.filter((category: Icategories) => {
      if (category.name == e.target.value.split('_')[1]) {
        //Informacion de las subcategorias
        this.subcategoriesService
          .getFilterData('category', category.name)
          .subscribe((resp: any) => {
            this.subcategories = Object.keys(resp).map((a) => ({
              name: resp[a].name,
              titleList: resp[a].title_list,
              url: resp[a].url,
            }));
          });
      }
    });
  }

  //Filtro para el listado de titulo
  public selectSubcategory(e: any): void {
    this.subcategories.filter((subcategory: any) => {
      if (subcategory.name == e.target.value.split('_')[1]) {
        this.titleList = subcategory.titleList;
      }
    });
  }

  //Validamos imagen
  public async validateImage(e: any, type: string): Promise<void> {
    let resp: string = '';
    try {
      resp = await functions.validateImage(e);
    } catch (error) {
      console.error(error);
    }
    if (type == 'image') {
      this.imgTemp = resp;
    }
  }

  //Funciones de adicionar y eliminar imagenes de la galeria
  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
