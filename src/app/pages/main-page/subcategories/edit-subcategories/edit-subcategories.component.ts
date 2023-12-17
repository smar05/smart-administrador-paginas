import { CategoriesService } from './../../../../services/categories.service';
import { alerts } from './../../../../helpers/alerts';
import { Isubcategories } from './../../../../interface/isubcategories';
import { functions } from './../../../../helpers/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import '../../../../shared/spinkit/sk-cube-grid.css';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { EnumCategorieState, Icategories } from 'src/app/interface/icategories';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-subcategories',
  templateUrl: './edit-subcategories.component.html',
  styleUrls: ['./edit-subcategories.component.css'],
})
export class EditSubcategoriesComponent implements OnInit {
  //Grupo de controles
  public f = this.form.group({
    titleList: ['', Validators.required],
    category: ['', Validators.required],
  });
  //Validacion personalizada
  get titleList() {
    return this.f.controls.titleList;
  }
  get category() {
    return this.f.controls.category;
  }

  //Variable que valida el envio del formulario
  public formSubmitted: boolean = false;
  //Visualizar el nombre de la categoria
  public categoryView: string = '';
  //Visualizar el nombre de la categoria
  public nameView: string = '';
  //Visualizar la url
  public urlInput: string = '';
  //Variables de inventario y visualizacion
  public products_inventory: string = '';
  public view: number = 0;
  public selectTL: string = '';
  public titleListArray: any = [];
  //Variable de precarga
  public loadData: boolean = false;
  public categories: any = [];

  constructor(
    private form: UntypedFormBuilder,
    private subcategoriesService: SubcategoriesService,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<EditSubcategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  ngOnInit(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.subcategoriesService
      .getItemFS(this.data.id, qf)
      .toPromise()
      .then((resp1: IFireStoreRes) => {
        let resp2: Isubcategories =
          this.subcategoriesService.formatIFireStoreResp(resp1);

        this.categoryView = resp2.category;
        this.titleList.setValue(resp2.title_list);
        this.selectTL = resp2.title_list;
        this.nameView = resp2.name;
        this.urlInput = resp2.url;
        this.view = resp2.view;

        //Traer la informacion de la categoria seleccionada
        let qf: QueryFn = (ref) =>
          ref
            .where(
              'idShop',
              '==',
              localStorage.getItem(EnumLocalStorage.localId)
            )
            .where('state', '==', EnumCategorieState.show);

        this.categoriesService
          .getItemFS(resp2.category, qf)
          .toPromise()
          .then((resp2: IFireStoreRes) => {
            let cat: Icategories = {
              ...this.categoriesService.formatIFireStoreRes(resp2),
            };
            this.category.setValue(cat.id);
            this.titleListArray = JSON.parse(cat.title_list);
            this.loadData = false;
          });
      });

    this.categoriesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: IFireStoreRes[]) => {
        this.categories = resp.map(
          (a: IFireStoreRes) =>
            ({
              ...this.categoriesService.formatIFireStoreRes(a),
            } as Icategories)
        );
        this.loadData = false;
      });
  }

  //Guardar subcategoria
  public editSubcategory(): any {
    this.formSubmitted = true;
    if (this.f.invalid) {
      return;
    }
    this.loadData = true;
    const dataSubcategory: Isubcategories | any = {
      category: this.categoryView,
      name: this.nameView,
      title_list: this.f.controls.titleList.value,
      url: this.urlInput,
      view: Number(this.view),
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    this.subcategoriesService.patchDataFS(this.data.id, dataSubcategory).then(
      () => {
        this.dialogRef.close('save');
        alerts.basicAlert(
          'Listo',
          'La subcategoria ha sido actualizada',
          'success'
        );
      },
      (err: any) => {
        alerts.basicAlert(
          'Error',
          'No se ha podido actualizar la subcategoria',
          'error'
        );
      }
    );

    this.loadData = false;
  }

  //Validar formulario
  public invalidField(field: string): any {
    return functions.invalidField(field, this.f, this.formSubmitted);
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
