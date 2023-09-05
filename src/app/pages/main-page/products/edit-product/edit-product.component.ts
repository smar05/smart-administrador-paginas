import { Isubcategories } from './../../../../interface/isubcategories';
import { MatChipInputEvent } from '@angular/material/chips';
import { Icategories } from './../../../../interface/icategories';
import { IQueryParams } from './../../../../interface/i-query-params';
import { functions } from 'src/app/helpers/functions';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import { CategoriesService } from './../../../../services/categories.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Iproducts, EnumProductImg } from './../../../../interface/iproducts';
import { ProductsService } from './../../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormGroup,
} from '@angular/forms';
import { alerts } from 'src/app/helpers/alerts';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  public id: string = '';
  public productEnDb!: Iproducts;
  public galeriaValores: Map<string, string> = new Map(); // <url,nombre>
  public imagenesABorrarGaleria: string[] = [];

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
    sub_category: ['', [Validators.required]],
    image: ['', []], //No se guarda en base de datos
    description: ['', [Validators.required]],
    summary: [[], [Validators.required]],
    details: new UntypedFormArray([]),
    specifications: new UntypedFormArray([]),
    tags: [
      [],
      [Validators.required, Validators.pattern(/[0-9a-zA-ZáéíóúñÁÉÍÓÚ ]/)],
    ],
    top_banner: new UntypedFormArray([]),
    default_banner: ['', []], //No se guarda en base de datos
    horizontal_slider: new UntypedFormArray([]),
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
    type_offer: [''],
    value_offer: ['', [Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    date_offer: [''],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
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

  get top_banner() {
    return this.f.controls.top_banner as any;
  }

  get default_banner() {
    return this.f.controls.default_banner;
  }

  get horizontal_slider() {
    return this.f.controls.horizontal_slider as any;
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
  public categoryName: string = '';

  //Variable con las subcategorias
  public subcategories: any[] = [];

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
  public editGallery: string[] = [];
  public allGallery: string[] = [];

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
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private form: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //obtener categorias
    this.getCategories();
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params.id;

      this.getData();
    });
  }

  public getData(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.productsService
      .getItemFS(this.id, qf)
      .toPromise()
      .then(async (resp: IFireStoreRes) => {
        let resp2: Iproducts = { id: resp.id, ...resp.data };

        this.productEnDb = resp2;

        this.name.setValue(resp2.name);
        this.urlInput = resp2.url;
        this.categoryName = resp2.category;
        this.titleList = resp2.title_list;
        this.delivery_time.setValue(resp2.delivery_time);
        this.description.setValue(resp2.description);
        this.price.setValue(resp2.price);
        this.shipping.setValue(resp2.shipping);
        this.stock.setValue(resp2.stock);
        this.summary.setValue(JSON.parse(resp2.summary));
        this.tags.setValue(JSON.parse(resp2.tags));
        this.type_video.setValue(JSON.parse(resp2.video)[0]);
        this.id_video.setValue(JSON.parse(resp2.video)[1]);
        this.type_offer.setValue(JSON.parse(resp2.offer)[0]);
        this.value_offer.setValue(JSON.parse(resp2.offer)[1]);
        this.date_offer.setValue(JSON.parse(resp2.offer)[2]);

        JSON.parse(resp2.summary).forEach((sum: string, index: number) => {
          this.summaryGroup[index] = { input: sum };
        });

        JSON.parse(resp2.details).forEach((detail: any, index: number) => {
          this.details.push(
            this.form.group({
              title: [detail.title, [Validators.required]],
              value: [detail.value, [Validators.required]],
            })
          );
        });

        if (JSON.parse(resp2.specification).length > 0) {
          JSON.parse(resp2.specification).forEach(
            (spec: any, index: number) => {
              const specValue = Object.keys(spec).map(
                (a: any) =>
                  ({
                    key: a,
                    values: spec[a],
                  } as any)
              );

              this.specifications.push(
                this.form.group({
                  type: [specValue[0].key],
                  values: [specValue[0].values],
                })
              );
            }
          );
        }

        this.top_banner.push(
          this.form.group({
            H3_tag: [
              JSON.parse(resp2.top_banner)['H3_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            P1_tag: [
              JSON.parse(resp2.top_banner)['P1_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            H4_tag: [
              JSON.parse(resp2.top_banner)['H4_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            P2_tag: [
              JSON.parse(resp2.top_banner)['P2_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            Span_tag: [
              JSON.parse(resp2.top_banner)['Span_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            Button_tag: [
              JSON.parse(resp2.top_banner)['Button_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            IMG_tag: ['', []], //No se guarda en base de datos
          })
        );

        this.horizontal_slider.push(
          this.form.group({
            H4_tag: [
              JSON.parse(resp2.horizontal_slider)['H4_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            H3_1_tag: [
              JSON.parse(resp2.horizontal_slider)['H3_1_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            H3_2_tag: [
              JSON.parse(resp2.horizontal_slider)['H3_2_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            H3_3_tag: [
              JSON.parse(resp2.horizontal_slider)['H3_3_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            H3_4s_tag: [
              JSON.parse(resp2.horizontal_slider)['H3_4s_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            Button_tag: [
              JSON.parse(resp2.horizontal_slider)['Button_tag'],
              [Validators.required, Validators.maxLength(50)],
            ],
            IMG_tag: ['', []], //No se guarda en base de datos
          })
        );

        //Obtener imagenes del producto
        this.imgTemp = await this.productsService.getImage(
          `${this.id}/${EnumProductImg.main}`
        );
        this.imgTempDB = await this.productsService.getImage(
          `${this.id}/${EnumProductImg.default_banner}`
        );
        this.imgTempHSlider = await this.productsService.getImage(
          `${this.id}/${EnumProductImg.horizontal_slider}`
        );
        this.imgTempTB = await this.productsService.getImage(
          `${this.id}/${EnumProductImg.top_banner}`
        );
        if (resp2.gallery) {
          JSON.parse(resp2.gallery).forEach(async (galleryItem: string) => {
            let urlImage: string = await this.productsService.getImage(
              `${this.id}/${EnumProductImg.gallery}/${galleryItem}`
            );
            this.allGallery.push(urlImage);
            this.editGallery.push(urlImage);
            this.galeriaValores.set(urlImage, galleryItem);
          });
        }

        let category: Icategories = this.categories.find(
          (category: Icategories) => {
            return category.url == resp2.category;
          }
        );

        //Informacion de las subcategorias
        let params: IQueryParams = {
          orderBy: '"category"',
          equalTo: `"${category.name}"`,
        };
        let qf: QueryFn = (ref) =>
          ref
            .where(
              'idShop',
              '==',
              localStorage.getItem(EnumLocalStorage.localId)
            )
            .where('category', '==', category.name);

        this.subcategoriesService
          .getDataFS(qf)
          .toPromise()
          .then((res: IFireStoreRes[]) => {
            this.subcategories = res.map(
              (a: IFireStoreRes) =>
                ({
                  name: a.data.name,
                  titleList: a.data.title_list,
                  url: a.data.url,
                  idShop: a.data.idShop,
                } as Isubcategories | any)
            );

            let subCategory: Isubcategories = this.subcategories.find(
              (subCategory: Isubcategories) =>
                subCategory.url == resp2.sub_category
            );

            this.sub_category.setValue(
              `${subCategory.url}_${subCategory.name}`
            );
          });

        this.loadData = false;
      });
  }

  //Guardar producto
  public async saveProduct(): Promise<void> {
    this.formSubmitted = true;

    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      alerts.basicAlert(
        'Error',
        'Se encontro un error en el formulario',
        'error'
      );
      return;
    }
    if (this.files.length + this.editGallery.length > 4) {
      alerts.basicAlert(
        'Error',
        'Ha seleccionado mas de 4 imagenes de la galeria',
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
    } else {
      specifications = '';
    }

    //Informacion del formulario en la interfaz
    const dataProduct: Iproducts = {
      category: this.categoryName,
      date_created: this.productEnDb.date_created,
      delivery_time: this.f.controls.delivery_time.value,
      description: this.f.controls.description.value,
      details: JSON.stringify(this.details.value),
      feedback: JSON.stringify({ type: 'approved', comment: '' }),
      horizontal_slider: JSON.stringify(
        this.horizontal_slider.value.map((top: any) => {
          if (top.IMG_tag) delete top.IMG_tag;
          return top;
        })[0]
      ),
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
      sales: this.productEnDb.sales,
      shipping: this.f.controls.shipping.value,
      specification: specifications,
      stock: this.f.controls.stock.value,
      store: this.productEnDb.store,
      sub_category: this.f.controls.sub_category.value.split('_')[0],
      summary: JSON.stringify(this.f.controls.summary.value),
      tags: JSON.stringify(this.f.controls.tags.value),
      title_list: this.titleList,
      top_banner: JSON.stringify(
        this.top_banner.value.map((top: any) => {
          if (top.IMG_tag) delete top.IMG_tag;
          return top;
        })[0]
      ),
      url: this.urlInput,
      vertical_slider: this.productEnDb.vertical_slider,
      video: this.id_video.value
        ? JSON.stringify([this.type_video.value, this.id_video.value])
        : '',
      views: this.productEnDb.views,
      gallery: this.productEnDb.gallery,
      delete: false,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    //Guardar la informacion del producto en base de datos
    this.productsService.patchDataFS(this.id, dataProduct).then(
      async () => {
        //Guardar las imagenes en storage
        if (this.imgFile && this.imgTemp) {
          await this.productsService.deleteImages(
            `${this.id}/${EnumProductImg.main}`
          );
          await this.saveProductImages(
            this.id,
            this.imgFile,
            EnumProductImg.main
          );
        }
        if (this.imgHSliderFile && this.imgTempHSlider) {
          await this.productsService.deleteImages(
            `${this.id}/${EnumProductImg.horizontal_slider}`
          );
          await this.saveProductImages(
            this.id,
            this.imgHSliderFile,
            EnumProductImg.horizontal_slider
          );
        }
        if (this.imgTBFile && this.imgTempTB) {
          await this.productsService.deleteImages(
            `${this.id}/${EnumProductImg.top_banner}`
          );
          await this.saveProductImages(
            this.id,
            this.imgTBFile,
            EnumProductImg.top_banner
          );
        }
        if (this.imgDBFile && this.imgTempDB) {
          await this.productsService.deleteImages(
            `${this.id}/${EnumProductImg.default_banner}`
          );
          await this.saveProductImages(
            this.id,
            this.imgDBFile,
            EnumProductImg.default_banner
          );
        }

        let nombreGaleriaAGuardar: string[] = [];
        // Se guardan las imagenes nuevas
        if (this.files && this.files.length > 0) {
          let nombres: string[] = await this.saveProductGallery(
            this.id,
            this.files
          );
          nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(nombres);
        }
        // Se eliminan las imagenes antiguas que el usuario quizo borrar
        if (
          this.imagenesABorrarGaleria &&
          this.imagenesABorrarGaleria.length > 0 &&
          dataProduct.gallery
        ) {
          this.imagenesABorrarGaleria.forEach(async (url: string) => {
            let name: string | undefined = this.galeriaValores.get(url);

            dataProduct.gallery = JSON.stringify(
              JSON.parse(dataProduct.gallery).filter(
                (nameEnDB: string) => nameEnDB != name
              )
            );

            await this.productsService.deleteImages(
              `${this.id}/${EnumProductImg.gallery}/${name}`
            );
          });
        }

        nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(
          JSON.parse(dataProduct.gallery)
        );

        dataProduct.gallery = JSON.stringify(nombreGaleriaAGuardar);

        if (dataProduct.gallery)
          await this.productsService.patchDataFS(this.id, dataProduct).then();

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
        let params: IQueryParams = {
          orderBy: '"url"',
          equalTo: `"${name}"`,
        };
        let qf: QueryFn = (ref) =>
          ref
            .where(
              'idShop',
              '==',
              localStorage.getItem(EnumLocalStorage.localId)
            )
            .where('url', '==', name)
            .limit(2);

        this.productsService
          .getDataFS(qf)
          .toPromise()
          .then((resp: IFireStoreRes[]) => {
            if (Object.keys(resp).length > 1) {
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
        let params: IQueryParams = {
          orderBy: '"category"',
          equalTo: `"${category.name}"`,
        };
        let qf: QueryFn = (ref) =>
          ref
            .where(
              'idShop',
              '==',
              localStorage.getItem(EnumLocalStorage.localId)
            )
            .where('category', '==', category.name);

        this.subcategoriesService
          .getDataFS(qf)
          .toPromise()
          .then((resp: IFireStoreRes[]) => {
            this.subcategories = resp.map((a: IFireStoreRes) => {
              return {
                name: a.data.name,
                titleList: a.data.title_list,
                url: a.data.url,
                idShop: a.data.idShop,
              };
            });
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
              name: a.data.name,
              titleList: JSON.parse(a.data.title_list),
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

  //Remover fotos de la galeria
  public removeGallery(pic: string): void {
    this.editGallery.splice(this.editGallery.indexOf(pic), 1);
    this.allGallery.splice(this.editGallery.indexOf(pic), 1);
    this.imagenesABorrarGaleria.push(pic);
  }
}
