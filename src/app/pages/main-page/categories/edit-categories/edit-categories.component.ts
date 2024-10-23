import { alerts } from './../../../../helpers/alerts';
import {
  EnumCategorieImg,
  Icategories,
} from './../../../../interface/icategories';
import { CategoriesService } from './../../../../services/categories.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css'],
})
export class EditCategoriesComponent implements OnInit {
  //Creamos grupo de controles
  public f = this.form.group({
    icon: ['', Validators.required],
    image: '',
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.pattern('[,\\a-zA-ZáéíóúñÁÉÍÓÚ ]*'),
        ],
        asyncValidators: [this.isRepeatCategory()],
        updateOn: 'blur',
      },
    ],
  });
  //Validacion personalizada
  get icon() {
    return this.f.controls.icon;
  }
  get image() {
    return this.f.controls.image;
  }
  get name() {
    return this.f.controls.name;
  }

  public formSubmit: boolean = false;
  public imgTemp: string = '';
  public imageFile!: File;
  public imageChange: boolean = false;
  public urlInput: string = '';
  public iconView: string = '';
  public loadData: boolean = false;
  public nameView: string = '';
  public state: string = '';
  public view: number = 0;
  private idShop: string = '';

  constructor(
    private form: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<EditCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  ngOnInit(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.categoriesService
      .getItemFS(this.data.id, qf)
      .toPromise()
      .then(async (resp: IFireStoreRes) => {
        this.icon.setValue(resp.data.icon);
        this.iconView = `<i class="${resp.data.icon}"></i>`;
        this.imgTemp = await this.categoriesService.getImage(
          `${this.data.id}/${EnumCategorieImg.main}`
        );
        this.name.setValue(resp.data.name);
        this.nameView = resp.data.name;
        this.urlInput = resp.data.url;
        this.state = resp.data.state;
        this.view = resp.data.view;
        this.idShop = resp.data.idShop;
        this.loadData = false;
      });
  }

  public async editCategory(): Promise<void> {
    //Validamos que el formulario haya sido enviado
    this.formSubmit = true;
    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
    this.loadData = true;

    //Verificamos cambio de icono
    let icon = this.f.controls.icon.value;
    if (this.f.controls.icon.value.split('"')[1] != undefined) {
      icon = this.f.controls.icon.value.split('"')[1];
    }

    //Capturamos la informacion del formulario en la interfaz
    const dataCategory: Icategories = {
      icon: icon,
      name: this.f.controls.name.value,
      url: this.urlInput,
      view: Number(this.view),
      state: this.state,
      idShop: this.idShop,
    };

    //Guardar en base de datos la categoria
    this.categoriesService.patchDataFS(this.data.id, dataCategory).then(
      async () => {
        //Verificar si hay cambio de imagen
        if (this.imageChange) {
          //Borrado de la imagen anterior
          try {
            if (this.data.id)
              await this.categoriesService.deleteImages(
                `${this.data.id}/${EnumCategorieImg.main}/`
              );
          } catch (error) {
            alerts.basicAlert(
              'Error',
              'No se pudo eliminar la imagen anterior',
              'error'
            );
            this.loadData = false;
            this.imageChange = false;
            return;
          }

          let name: string = `${EnumCategorieImg.main}.${
            this.imageFile.name.split('.')[1]
          }`;

          let a: any = null;

          try {
            if (this.imageFile && this.data.id)
              a = await this.categoriesService.saveImage(
                this.imageFile,
                `${this.data.id}/${EnumCategorieImg.main}/${name}`
              );
          } catch (error) {
            alerts.basicAlert(
              'Error',
              'Ha ocurrido un error guardando la imagen de la categoria',
              'error'
            );
            this.loadData = false;
            this.imageChange = false;
            return;
          }
        }

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

  //Validacion de la imagen
  public validateImage(e: any): void {
    functions
      .validateImage(e)
      .then((resp: any) => {
        if (resp) {
          this.imgTemp = resp;
          this.imageChange = true;

          this.imageFile = e.target.files[0];
        } else {
          this.imgTemp = '';
          this.imageChange = false;
        }
      })
      .catch((err) => {
        this.imageChange = false;
        alerts.basicAlert('Error', 'Imagen no valida', 'error');
      });
  }

  //Validar que el nombre de categoria no se repita
  public isRepeatCategory() {
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
        this.categoriesService
          .getDataFS(qf)
          .toPromise()
          .then((resp: IFireStoreRes[]) => {
            if (Object.keys(resp).length > 0) {
              resolve({ category: true });
            } else {
              this.urlInput = name;
            }
          });
      });
    };
  }

  //Visualizar icono
  public viewIcon(e: any): void {
    this.iconView = e.target.value;
    e.target.value = this.f.controls.icon.value.split('"')[1];
  }
}
