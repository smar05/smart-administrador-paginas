import { alerts } from './../../../../helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Isubcategories } from './../../../../interface/isubcategories';
import { MatDialogRef } from '@angular/material/dialog';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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
  public loadData: boolean = false;

  constructor(
    private form: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    public dialogRef: MatDialogRef<NewSubcategoriesComponent>
  ) {}

  ngOnInit(): void {}

  //Guardar subcategoria
  public saveSubcategory(): void {
    this.loadData = true;
    //Validamos que el formulario haya sido enviado
    this.formSubmit = true;
    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
    //Capturamos la informacion del formulario en la interfaz
    const dataCategory: Isubcategories = {
      category: this.f.controls.category.value,
      name: this.f.controls.name.value,
      title_list: this.f.controls.titleList.value,
      url: this.urlInput,
      products_inventory: 0,
      view: 0,
    };
    //Guardar en base de datos la categoria
    this.subcategoriesService
      .postData(dataCategory, localStorage.getItem('token'))
      .subscribe(
        (resp) => {
          this.loadData = false;
          this.dialogRef.close('save');
          alerts.basicAlert(
            'Listo',
            'La categoria ha sido guardada',
            'success'
          );
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
        this.subcategoriesService
          .getFilterData('url', name)
          .subscribe((resp) => {
            if (Object.keys(resp).length > 0) {
              resolve({ subcategory: true });
            } else {
              this.urlInput = name;
            }
          });
      });
    };
  }
}
