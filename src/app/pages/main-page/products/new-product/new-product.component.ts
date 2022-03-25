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
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  //Variable para validar el envio del formulario
  public formSubmitted: boolean = false;

  //Variable de precarga
  public loadData: boolean = false;

  //Variable global de la url
  public urlInput: string = '';

  constructor(
    private form: FormBuilder,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {}

  //Guardar producto
  public saveProduct(): void {
    this.formSubmitted = true;

    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      return;
    }
    this.loadData = true;
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
}
