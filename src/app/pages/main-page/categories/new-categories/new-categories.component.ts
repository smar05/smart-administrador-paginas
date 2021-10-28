import { CategoriesService } from './../../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Fruit {
  name: string;
}

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
        Validators.pattern('["\\[\\]\\-\\,\\a-zA-ZáéíóúñÁÉÍÓÚ ]*'),
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
  public formSubmit: boolean = false;
  public imgTemp: string = '';
  public urlInput: string = '';

  //Configuracion matChip
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  constructor(
    private form: FormBuilder,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {}

  public saveCategory(): void {
    //Validamos que el formulario haya sido enviado
    this.formSubmit = true;
    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
  }

  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmit);
  }

  //Validacion de la imagen
  public validateImage(e: any): void {
    functions.validateImage(e).then((resp: any) => {
      this.imgTemp = resp;
    });
  }

  //Validar que el nombre de categoria no se repita
  public isRepeatCategory() {
    return (control: AbstractControl) => {
      const name = functions.createUrl(control.value);
      return new Promise((resolve) => {
        this.categoriesService.getFilterData('url', name).subscribe((resp) => {
          console.log(resp);

          if (Object.keys(resp).length > 0) {
            resolve({ category: true });
          } else {
            this.urlInput = name;
            resolve({ category: false });
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
}
