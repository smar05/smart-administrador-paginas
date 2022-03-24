import { functions } from './../../../../helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
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
    name: ['', [Validators.required]],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  //Variable para validar el envio del formulario
  public formSubmitted: boolean = false;

  //Variable de precarga
  public loadData: boolean = false;

  constructor(private form: FormBuilder) {}

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
}
