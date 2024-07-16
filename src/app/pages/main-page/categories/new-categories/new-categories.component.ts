import { alerts } from './../../../../helpers/alerts';
import {
  EnumCategorieImg,
  EnumCategorieState,
  Icategories,
} from './../../../../interface/icategories';
import { CategoriesService } from './../../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-new-categories',
  templateUrl: './new-categories.component.html',
  styleUrls: ['./new-categories.component.css'],
})
export class NewCategoriesComponent implements OnInit {
  //Creamos grupo de controles
  public f = this.form.group({
    icon: ['', Validators.required],
    image: ['', Validators.required],
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
    titleList: [
      [],
      [
        Validators.required,
        Validators.pattern('["\\[\\]\\-\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]*'),
      ],
    ],
  });
  //Validacion personalizada
  get name() {
    return this.f.controls.name;
  }
  get image() {
    return this.f.controls.image;
  }
  get titleList() {
    return this.f.controls.titleList;
  }
  get icon() {
    return this.f.controls.icon;
  }
  public formSubmit: boolean = false;
  public imgTemp: string = '';
  public urlInput: string = '';
  public iconView: string = '';
  public loadData: boolean = false;
  public imageFile!: File;

  //Configuracion matChip
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private form: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<NewCategoriesComponent>
  ) {}

  ngOnInit(): void {}

  public async saveCategory(): Promise<void> {
    //Validamos que el formulario haya sido enviado
    this.formSubmit = true;
    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
    this.loadData = true;
    //Capturamos la informacion del formulario en la interfaz
    const dataCategory: Icategories = {
      icon: this.f.controls.icon.value.split('"')[1],
      name: this.f.controls.name.value,
      title_list: JSON.stringify(this.f.controls.titleList.value),
      url: this.urlInput,
      view: 0,
      state: EnumCategorieState.hidden,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    //Guardar en base de datos la categoria
    this.categoriesService.postDataFS(dataCategory).then(
      async (resp: any) => {
        this.loadData = false;
        this.dialogRef.close('save');
        alerts.basicAlert('Listo', 'La categoria ha sido guardada', 'success');
      },
      (err) => {
        this.loadData = false;
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error guardando la categoria',
          'error'
        );
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

          this.imageFile = e.target.files[0];
        } else {
          this.imgTemp = '';
        }
      })
      .catch((err) => {
        alerts.basicAlert('Error', 'Imagen no valida', 'error');
      });
  }

  //Validar que el nombre de categoria no se repita
  public isRepeatCategory() {
    return (control: AbstractControl) => {
      const name = functions.createUrl(control.value);
      return new Promise((resolve) => {
        let qf: QueryFn = (q) =>
          q
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
            if (resp.length > 0) {
              resolve({ category: true });
            } else {
              this.urlInput = name;
            }
          });
      });
    };
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if ((value || '').trim()) {
      this.f.controls.titleList.value.push(value.trim());
    }

    // Clear the input value
    event.chipInput!.clear();
    this.f.controls.titleList.updateValueAndValidity();
  }

  public remove(titulo: any): void {
    const index = this.f.controls.titleList.value.indexOf(titulo);

    if (index >= 0) {
      this.f.controls.titleList.value.splice(index, 1);
    }
    this.f.controls.titleList.updateValueAndValidity();
  }

  //Visualizar icono
  public viewIcon(e: any): void {
    this.iconView = e.target.value;
    e.target.value = this.f.controls.icon.value.split('"')[1];
  }
}
