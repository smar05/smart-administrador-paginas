import { IQueryParams } from './../../../../interface/i-query-params';
import { CategoriesService } from './../../../../services/categories.service';
import { alerts } from './../../../../helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Isubcategories } from './../../../../interface/isubcategories';
import { MatDialogRef } from '@angular/material/dialog';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import {
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { Icategories } from 'src/app/interface/icategories';

@Component({
  selector: 'app-new-subcategories',
  templateUrl: './new-subcategories.component.html',
  styleUrls: ['./new-subcategories.component.css'],
})
export class NewSubcategoriesComponent implements OnInit {
  //Creamos grupo de controles
  public f = this.form.group({
    category: ['', Validators.required],
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.pattern('[,\\a-zA-Z0-9áéíóúñÁÉÍÓÚ ]*'),
        ],
        asyncValidators: [this.isRepeatSubcategory()],
        updateOn: 'blur',
      },
    ],
    titleList: [
      [],
      [
        Validators.required,
        Validators.pattern('["\\[\\]\\-\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]*'),
      ],
    ],
  });

  //Validacion personalizada
  get category() {
    return this.f.controls.category;
  }
  get name() {
    return this.f.controls.name;
  }
  get titleList() {
    return this.f.controls.titleList;
  }
  public formSubmit: boolean = false;
  public urlInput: string = '';
  public categories: any = [];
  public titleListArray: any = [];
  public loadData: boolean = false;

  constructor(
    private form: UntypedFormBuilder,
    private subcategoriesService: SubcategoriesService,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<NewSubcategoriesComponent>
  ) {}

  ngOnInit(): void {
    //Capturamos la informacion de categorias
    this.loadData = true;
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
              idShop: a.data.idShop,
            } as Icategories)
        );
        this.loadData = false;
      });
  }

  //Guardar subcategoria
  public saveSubcategory(): void {
    //Validamos que el formulario haya sido enviado
    this.formSubmit = true;
    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
    this.loadData = true;
    //Capturamos la informacion del formulario en la interfaz
    const dataCategory: Isubcategories = {
      category: this.f.controls.category.value,
      name: this.f.controls.name.value,
      title_list: this.f.controls.titleList.value,
      url: this.urlInput,
      products_inventory: 0,
      view: 0,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };
    //Guardar en base de datos la categoria
    this.subcategoriesService.postDataFS(dataCategory).then(
      (resp) => {
        this.loadData = false;
        this.dialogRef.close('save');
        alerts.basicAlert('Listo', 'La categoria ha sido guardada', 'success');
      },
      (err) => {
        this.loadData = false;
        alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');
      }
    );
  }

  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmit);
  }

  //Validar que el nombre de subcategoria no se repita
  public isRepeatSubcategory() {
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
            .limit(1);

        this.subcategoriesService
          .getDataFS(qf)
          .toPromise()
          .then((resp: IFireStoreRes[]) => {
            if (Object.keys(resp).length > 0) {
              resolve({ subcategory: true });
            } else {
              this.urlInput = name;
            }
          });
      });
    };
  }

  //Filtrar el listado de titulo
  public selectCategory(e: any): any {
    this.categories.filter((category: any) => {
      if (category.name == e.target.value) {
        this.titleListArray = category.titleList;
      }
    });
  }
}
