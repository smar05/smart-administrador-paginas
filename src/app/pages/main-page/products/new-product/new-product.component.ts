import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { alerts } from './../../../../helpers/alerts';
import { Icategories } from './../../../../interface/icategories';
import { CategoriesService } from './../../../../services/categories.service';
import {
  Iproducts,
  EnumProductImg,
  EnumProductReviewType,
} from './../../../../interface/iproducts';
import { ProductsService } from './../../../../services/products.service';
import { functions } from './../../../../helpers/functions';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
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
    image: ['', [Validators.required]], //No se guarda en base de datos
    description: ['', [Validators.required]],
    summary: [[], [Validators.required]],
    details: new UntypedFormArray([
      this.form.group({
        title: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
    ]),
    specifications: new UntypedFormArray([
      this.form.group({
        type: [''],
        values: [[]],
      }),
    ]),
    tags: [
      [],
      [Validators.required, Validators.pattern(/[0-9a-zA-ZáéíóúñÁÉÍÓÚ ]/)],
    ],
    type_video: [''],
    id_video: [''],
    price: [
      '',
      [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)],
    ],
    shipping: [
      '',
      [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)],
    ],
    delivery_time: [
      '',
      [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)],
    ],
    stock: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    type_offer: ['Discount'],
    value_offer: ['', [Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    date_offer: [''],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get category() {
    return this.f.controls.category;
  }

  get image() {
    return this.f.controls.image;
  }

  get description() {
    return this.f.controls.description;
  }

  get summary() {
    return this.f.controls.summary;
  }

  get details() {
    return this.f.controls.details as any;
  }

  get specifications() {
    return this.f.controls.specifications as any;
  }

  get tags() {
    return this.f.controls.tags;
  }

  get type_video() {
    return this.f.controls.type_video;
  }

  get id_video() {
    return this.f.controls.id_video;
  }

  get price() {
    return this.f.controls.price;
  }

  get shipping() {
    return this.f.controls.shipping;
  }

  get delivery_time() {
    return this.f.controls.delivery_time;
  }

  get stock() {
    return this.f.controls.stock;
  }

  get type_offer() {
    return this.f.controls.type_offer;
  }

  get value_offer() {
    return this.f.controls.value_offer;
  }

  get date_offer() {
    return this.f.controls.date_offer;
  }

  //Variable para validar el envio del formulario
  public formSubmitted: boolean = false;

  //Variable de precarga
  public loadData: boolean = false;

  //Variable global de la url
  public urlInput: string = '';

  //Variable con las categorias
  public categories: any[] = [];

  //Variable para el listado de titulo
  public titleList: string = '';

  //Variable para la imagen del producto
  public imgTemp: string = '';
  public imgFile!: File;
  public imgTBFile!: File;
  public imgDBFile!: File;
  public imgHSliderFile!: File;

  //Galeria de imagenes del producto
  public files: File[] = [];

  //Imagen temporal del top banner
  public imgTempTB: string = '';
  public uploadFileTB: string = '';
  public imgTempDB: string = '';
  public imgTempHSlider: string = '';

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

  //Configuracion matChip
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  //Variable para el resumen del producto
  public summaryGroup: any[] = [
    {
      input: '',
    },
  ];

  constructor(
    private form: UntypedFormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //obtener categorias
    this.getCategories();
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

    //Validamos las especificaciones del producto
    let specifications: any = null;
    let specLocal: AbstractControl = this.f.controls.specifications;

    if (Object.keys(specLocal.value.length > 0)) {
      let newSpecifications: any = [];

      for (const i in specLocal.value) {
        let newValue: any = [];
        let a: any = {};
        for (const f in specLocal.value[i].values) {
          newValue.push(`${specLocal.value[i].values[f]}`);
        }
        a[specLocal.value[i].type] = newValue;
        newSpecifications.push(a);
      }
      specifications = JSON.stringify(newSpecifications);
      //specifications = specifications.replace(/["]/g, '');
      //specifications = specifications.replace(/[']/g, '');

      /*if (specifications == '[{"":[]}]') {
        specifications = '';
      }*/
    } else {
      specifications = '';
    }

    //Informacion del formulario en la interfaz
    const dataProduct: Iproducts = {
      category: this.f.controls.category.value.split('_')[0],
      date_created: new Date(),
      date_updated: new Date(),
      delivery_time: this.f.controls.delivery_time.value,
      description: this.f.controls.description.value,
      details: JSON.stringify(this.details.value),
      feedback: EnumProductReviewType.approved,
      name: this.f.controls.name.value,
      offer: this.value_offer.value
        ? JSON.stringify([
            this.type_offer.value,
            this.value_offer.value,
            this.date_offer.value,
          ])
        : '',
      price: this.f.controls.price.value,
      reviews: JSON.stringify([]),
      sales: 0,
      shipping: this.f.controls.shipping.value,
      specification: specifications,
      stock: this.f.controls.stock.value,
      summary: JSON.stringify(this.f.controls.summary.value),
      tags: JSON.stringify(this.f.controls.tags.value),
      url: this.urlInput,
      video: this.id_video.value
        ? JSON.stringify([this.type_video.value, this.id_video.value])
        : '',
      views: 0,
      gallery: '',
      delete: false,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    //Guardar la informacion del producto en base de datos
    this.productsService.postDataFS(dataProduct).then(
      async (res: any) => {
        //Guardar las imagenes en storage
        if (this.imgFile)
          await this.saveProductImages(
            res.id,
            this.imgFile,
            EnumProductImg.main
          );
        if (this.imgHSliderFile)
          await this.saveProductImages(
            res.id,
            this.imgHSliderFile,
            EnumProductImg.horizontal_slider
          );
        if (this.imgTBFile)
          await this.saveProductImages(
            res.id,
            this.imgTBFile,
            EnumProductImg.top_banner
          );
        if (this.imgDBFile)
          await this.saveProductImages(
            res.id,
            this.imgDBFile,
            EnumProductImg.default_banner
          );
        if (this.files && this.files.length > 0) {
          let nombreGaleria: string[] = await this.saveProductGallery(
            res.id,
            this.files
          );

          dataProduct.gallery = JSON.stringify(nombreGaleria);
          await this.productsService.patchDataFS(res.id, dataProduct).then();
        }

        this.loadData = false;
        alerts.basicAlert('Listo', 'El producto ha sido guardado', 'success');
        this.router.navigate(['products']);
      },
      (err: any) => {
        this.loadData = false;
        alerts.basicAlert(
          'Error',
          'No se ha podido guardar el producto',
          'error'
        );
      }
    );
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
        let qf: QueryFn = (ref) =>
          ref
            .where(
              'idShop',
              '==',
              localStorage.getItem(EnumLocalStorage.localId)
            )
            .where('url', '==', name)
            .limit(1);

        this.productsService
          .getDataFS(qf)
          .toPromise()
          .then((resp: IFireStoreRes) => {
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

  //Validamos imagen
  public async validateImage(e: any, type: string): Promise<void> {
    let resp: string = '';
    try {
      resp = await functions.validateImage(e);
    } catch (error) {
      console.error(error);
      return;
    }
    if (resp) {
      switch (type) {
        case EnumProductImg.main:
          this.imgTemp = resp;
          this.imgFile = e.target.files[0];
          break;

        case EnumProductImg.top_banner:
          this.imgTempTB = resp;
          this.imgTBFile = e.target.files[0];
          break;

        case EnumProductImg.default_banner:
          this.imgTempDB = resp;
          this.imgDBFile = e.target.files[0];
          break;

        case EnumProductImg.horizontal_slider:
          this.imgTempHSlider = resp;
          this.imgHSliderFile = e.target.files[0];
          break;

        default:
          break;
      }
    } else {
      this.imgTemp = '';
      this.imgTempTB = '';
      this.imgTempDB = '';
      this.imgTempHSlider = '';
    }
  }

  //Funciones de adicionar y eliminar imagenes de la galeria
  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  //Adicionar input's dinamicos
  public addInput(type: string): void {
    if (type == 'summary') {
      if (this.summaryGroup.length < 5) {
        this.summaryGroup.push({
          input: '',
        });
      } else {
        alerts.basicAlert('Error', 'El limite de resumenes es de 5', 'error');
      }
    } else if (type == 'details') {
      if (this.details.length < 5) {
        this.details.push(
          this.form.group({
            title: ['', [Validators.required]],
            value: ['', [Validators.required]],
          })
        );
      } else {
        alerts.basicAlert('Error', 'El limite de detalles es de 5', 'error');
      }
    } else if (type == 'specifications') {
      if (this.specifications.length < 5) {
        this.specifications.push(
          this.form.group({
            type: [''],
            values: [[]],
          })
        );
      } else {
        alerts.basicAlert('Error', 'El limite de detalles es de 5', 'error');
      }
    }
  }

  //Eliminar input's dinamicos
  public removeInput(i: number, type: string): void {
    if (type == 'summary') {
      if (this.summaryGroup.length > 1) {
        this.summaryGroup.splice(i, 1);
        this.f.controls.summary.value.splice(i, 1);
        this.f.controls.summary.updateValueAndValidity();
      }
    } else if (type == 'details') {
      if (this.details.length > 1) {
        this.details.removeAt(i);
      }
    } else if (type == 'specifications') {
      if (this.specifications.length > 1) {
        this.specifications.removeAt(i);
      }
    }
  }

  //Adicionar resumen
  public addItem(e: any, type: string, i: number): void {
    if (type == 'summary') {
      if ((e.target.value || '').trim()) {
        this.f.controls.summary.value.push(e.target.value.trim());
      }
      this.f.controls.summary.updateValueAndValidity();
    }
  }

  //Matchips
  public add(event: MatChipInputEvent, index: number, type: string): void {
    const value = (event.value || '').trim();
    if (type == 'specifications') {
      let controlSpec = this.specifications.controls[index] as UntypedFormGroup;
      // Add our specification
      if ((value || '').trim()) {
        if (controlSpec.controls.values.value.length < 10) {
          controlSpec.controls.values.value.push(value.trim());
          controlSpec.controls.values.updateValueAndValidity();
        }
      }

      // Clear the input value
      event.chipInput!.clear();
      controlSpec.controls.values.updateValueAndValidity();
    } else if (type == 'tags') {
      this.f.controls.tags.value.push(value.trim());
      this.f.controls.tags.updateValueAndValidity();
    }
  }

  public remove(value: any, index: number, type: string): void {
    if (type == 'specifications') {
      let controlSpec = this.specifications.controls[index] as UntypedFormGroup;
      //const optIndex = controlSpec.controls.values.value.indexOf(value);

      if (index >= 0) {
        controlSpec.controls.values.value.splice(index, 1);
        controlSpec.controls.values.updateValueAndValidity();
      }
    } else if (type == 'tags') {
      const index = this.f.controls.tags.value.indexOf(value);
      if (index >= 0) {
        this.f.controls.tags.value.splice(index, 1);
        this.f.controls.tags.updateValueAndValidity();
      }
    }
  }

  public getCategories(): any {
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.categoriesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        this.categories = resp.map(
          (a: IFireStoreRes) =>
            ({
              id: a.id,
              name: a.data.name,
              url: a.data.url,
              idShop: a.data.idShop,
            } as Icategories)
        );
      });
  }

  public async saveProductImages(
    idProduct: string,
    imgFile: File,
    type: string
  ): Promise<void> {
    let name: string =
      idProduct && type && imgFile
        ? `${type}.${imgFile.name.split('.')[1]}`
        : '';

    if (name) {
      try {
        if (imgFile && idProduct)
          await this.productsService.saveImage(
            imgFile,
            `${idProduct}/${type}/${name}`
          );
      } catch (error) {
        alerts.basicAlert(
          'Error',
          `Ha ocurrido un error guardando la imagen ${type} del producto`,
          'error'
        );
        this.loadData = false;
        return;
      }
    }
  }

  public async saveProductGallery(
    idProduct: string,
    gallery: File[]
  ): Promise<string[]> {
    let nombres: string[] = [];

    for (let index = 0; index < gallery.length; index++) {
      let nameSinTipo: string = `${new Date().getTime()}_${index}`;
      let name: string =
        idProduct && gallery[index]
          ? `${nameSinTipo}.${gallery[index].name.split('.')[1]}`
          : '';

      if (name && idProduct) {
        try {
          await this.productsService.saveImage(
            gallery[index],
            `${idProduct}/${EnumProductImg.gallery}/${nameSinTipo}/${name}`
          );

          nombres.push(nameSinTipo);
        } catch (error) {
          alerts.basicAlert(
            'Error',
            `Ha ocurrido un error guardando la imagen de la galeria del producto`,
            'error'
          );
          this.loadData = false;
        }
      }
    }

    return nombres;
  }
}
