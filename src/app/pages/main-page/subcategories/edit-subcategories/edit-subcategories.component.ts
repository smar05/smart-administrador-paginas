import { alerts } from './../../../../helpers/alerts';
import { Isubcategories } from './../../../../interface/isubcategories';
import { functions } from './../../../../helpers/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubcategoriesService } from './../../../../services/subcategories.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import '../../../../shared/spinkit/sk-cube-grid.css';

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
  });
  //Validacion personalizada
  get titleList() {
    return this.f.controls.titleList;
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
  public view: string = '';
  //Variable de precarga
  public loadData: boolean = false;

  constructor(
    private form: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    public dialogRef: MatDialogRef<EditSubcategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  ngOnInit(): void {
    this.subcategoriesService.getItem(this.data.id).subscribe((resp: any) => {
      this.categoryView = resp.category;
      this.titleList.setValue(resp.title_list);
      this.nameView = resp.name;
      this.urlInput = resp.url;
      this.products_inventory = resp.products_inventory;
      this.view = resp.view;
    });
  }

  //Guardar subcategoria
  public editSubcategory(): any {
    this.loadData = true;
    this.formSubmitted = true;
    if (this.f.invalid) {
      return;
    }

    const dataSubcategory: Isubcategories = {
      category: this.categoryView,
      name: this.nameView,
      title_list: this.f.controls.titleList.value,
      url: this.urlInput,
      products_inventory: Number(this.products_inventory),
      view: Number(this.view),
    };

    this.subcategoriesService
      .patchData(this.data.id, dataSubcategory, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
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
}
