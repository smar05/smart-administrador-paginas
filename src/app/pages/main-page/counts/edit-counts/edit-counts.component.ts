import { IQueryParams } from './../../../../interface/i-query-params';
import { EnumLocalStorage } from './../../../../enums/enum-local-storage';
import { functions } from './../../../../helpers/functions';
import { alerts } from './../../../../helpers/alerts';
import { ICount, EnumCountPermission } from 'src/app/interface/icount';
import { LocationService } from './../../../../services/location.service';
import { CountService } from './../../../../services/count.service';
import { Validators, UntypedFormArray, FormBuilder } from '@angular/forms';
import { ICities } from './../../../../interface/icities';
import { IState } from './../../../../interface/istate';
import { ICountries } from './../../../../interface/icountries';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-counts',
  templateUrl: './edit-counts.component.html',
  styleUrls: ['./edit-counts.component.css'],
})
export class EditCountsComponent implements OnInit {
  public allCountries: ICountries[] = [];
  public allStatesByCountry: IState[] = [];
  public allCities: ICities[] = [];
  public cuentaActual: ICount | any = {};
  private cuenta: ICount = {};

  //Grupo de controles
  public f: any = this.form.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]{1,50}/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    celphone: [
      '',
      [
        Validators.required,
        Validators.max(9999999999),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    sex: ['', [Validators.required]],
    idType: ['', [Validators.required]], // Tipo de identificacion
    idValue: ['', Validators.required],
    activeCount: [true, [Validators.required]],
    permissions: new UntypedFormArray([]),
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get email() {
    return this.f.controls.email;
  }

  get celphone() {
    return this.f.controls.celphone;
  }

  get country() {
    return this.f.controls.country;
  }

  get state() {
    return this.f.controls.state;
  }

  get city() {
    return this.f.controls.city;
  }

  get sex() {
    return this.f.controls.sex;
  }

  get idValue() {
    return this.f.controls.idValue;
  }

  get idType() {
    return this.f.controls.idType;
  }

  get permissions() {
    return this.f.controls.permissions;
  }

  public formSubmitted: boolean = false;
  public loadData: boolean = false;
  public id: string = '';

  constructor(
    private form: FormBuilder,
    private countService: CountService,
    private locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<EditCountsComponent>
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.data.id;
    await this.getCuentaActual();
    await this.getCount();
    this.getCountries();
    this.getState();
    this.getCity();
  }

  public async getCuentaActual(): Promise<void> {
    this.cuentaActual = await this.countService.getCuentaActual();
  }

  public async getCount(): Promise<void> {
    let res1: IFireStoreRes = await this.countService
      .getItemFS(this.id)
      .toPromise();
    let res: ICount = { id: res1.id, ...res1.data };
    this.cuenta = res;

    let permission: any =
      res.permission == EnumCountPermission.admin
        ? EnumCountPermission.admin
        : JSON.parse(res.permission || '');

    this.name.setValue(res.name);
    this.email.setValue(res.email);
    this.celphone.setValue(res.celphone);
    this.idType.setValue(res.idType);
    this.idValue.setValue(res.idValue);
    this.country.setValue(res.country);
    this.state.setValue(res.state);
    this.city.setValue(res.city);
    this.sex.setValue(res.sex);
    this.permissions.push(
      permission == EnumCountPermission.admin
        ? this.form.group({
            users_read: [true, []],
            users_write: [true, []],
            categories_read: [true, []],
            categories_write: [true, []],
            subcategories_read: [true, []],
            subcategories_write: [true, []],
            store_read: [true, []],
            store_write: [true, []],
            products_read: [true, []],
            products_write: [true, []],
            orders_read: [true, []],
            orders_write: [true, []],
            sales_read: [true, []],
            sales_write: [true, []],
            disputes_read: [true, []],
            disputes_write: [true, []],
            messages_read: [true, []],
            messages_write: [true, []],
            counts_read: [true, []],
            counts_write: [true, []],
          })
        : this.form.group({
            users_read: [permission.users_read, []],
            users_write: [permission.users_write, []],
            categories_read: [permission.categories_read, []],
            categories_write: [permission.categories_write, []],
            subcategories_read: [permission.subcategories_read, []],
            subcategories_write: [permission.subcategories_write, []],
            store_read: [permission.store_read, []],
            store_write: [permission.store_write, []],
            products_read: [permission.products_read, []],
            products_write: [permission.products_write, []],
            orders_read: [permission.orders_read, []],
            orders_write: [permission.orders_write, []],
            sales_read: [permission.sales_read, []],
            sales_write: [permission.sales_write, []],
            disputes_read: [permission.disputes_read, []],
            disputes_write: [permission.disputes_write, []],
            messages_read: [permission.messages_read, []],
            messages_write: [permission.messages_write, []],
            counts_read: [permission.counts_read, []],
            counts_write: [permission.counts_write, []],
          })
    );
  }

  public async saveCount(): Promise<void> {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (this.f.invalid) {
      alerts.basicAlert('Error', 'Formulario invalido', 'error');
      return;
    }

    this.loadData = true;

    try {
      let permission: any = this.permissions.value[0];

      // Si estan todos los permisos, se asigna admin
      let setPermission: string =
        Object.keys(permission)
          .map((a: any) => {
            return permission[a];
          })
          .filter((a: boolean) => !a).length > 0
          ? JSON.stringify(permission)
          : EnumCountPermission.admin;

      const count: ICount = {
        ...this.cuenta,
        name: this.name.value,
        celphone: this.celphone.value,
        sex: this.sex.value,
        country: this.country.value,
        state: this.state.value,
        city: this.city.value,
        permission: setPermission,
        idType: this.idType.value,
        idValue: this.idValue.value,
      };

      delete count.id;

      await this.countService.patchDataFS(this.id, count).then();

      this.dialogRef.close('save');
      this.loadData = false;
    } catch (error: any) {
      console.error(error);

      let code: string = error.code;
      let errorText: string = '';

      switch (code) {
        case 'auth/email-already-in-use':
          errorText = 'El usuario ya existe';
          break;

        case 'auth/weak-password':
          errorText = 'La contraseña es muy debil';
          break;

        case 'auth/invalid-email':
          errorText = 'El correo es invalido';
          break;

        default:
          errorText = 'Se ha producido un error en el registro';
          break;
      }

      alerts.basicAlert('Error', errorText, 'error');
      this.loadData = false;
    }
  }

  /**
   *Validacion del formulario
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof RegisterComponent
   */
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }

  public async getCountries(): Promise<void> {
    try {
      this.allCountries = await this.locationService.getAllContries();
    } catch (error) {
      this.allCountries = [];
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry =
        await this.locationService.getAllStatesByCountry(this.country.value);
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = [];
    }
  }

  public async stateChange(): Promise<void> {
    try {
      this.city.setValue(null);
      this.allCities = await this.locationService.getAllCitiesByCountryAndState(
        this.country.value,
        this.state.value
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allCities = [];
    }
  }

  public async getState(): Promise<void> {
    try {
      this.allStatesByCountry =
        await this.locationService.getAllStatesByCountry(this.country.value);
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = [];
    }
  }

  public async getCity(): Promise<void> {
    try {
      this.allCities = await this.locationService.getAllCitiesByCountryAndState(
        this.country.value,
        this.state.value
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allCities = [];
    }
  }

  public canEditPermisos(): boolean {
    return (
      this.countService.hasPermission('counts_write') &&
      this.cuentaActual.email != this.email.value
    );
  }
}
