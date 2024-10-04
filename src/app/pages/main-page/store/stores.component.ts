import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { alerts } from 'src/app/helpers/alerts';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { ShopsDataService } from 'src/app/services/shops-data.service';
import { EnumPages } from '../../../enums/enum-pages';
import { IStore } from '../../../interface/istore';
import { AlertsPagesService } from '../../../services/alerts-pages.service';
import { CountService } from '../../../services/count.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],
})
export class StoresComponent implements OnInit {
  public store: IStore = null;
  public loadData: boolean = false;
  public f = this.form.group({
    back_color: ['', Validators.required],
    border_color: ['', Validators.required],
    footer_color: ['', Validators.required],
    menu_color: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(20)]],
    navbar_color: ['', Validators.required],
    slogan: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    celphone: [null, [Validators.max(9999999999)]],
  });

  get back_color() {
    return this.f.controls.back_color;
  }

  get border_color() {
    return this.f.controls.border_color;
  }

  get footer_color() {
    return this.f.controls.footer_color;
  }

  get menu_color() {
    return this.f.controls.menu_color;
  }

  get name() {
    return this.f.controls.name;
  }

  get navbar_color() {
    return this.f.controls.navbar_color;
  }

  get slogan() {
    return this.f.controls.slogan;
  }

  get email() {
    return this.f.controls.email;
  }

  get celphone() {
    return this.f.controls.celphone;
  }

  constructor(
    public countService: CountService,
    private alertsPagesService: AlertsPagesService,
    private shopsDataService: ShopsDataService,
    private form: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getData();
  }

  private getData(): void {
    this.loadData = true;
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.shopsDataService
      .getDataFS(qf)
      .toPromise()
      .then((res: IFireStoreRes[]): any => {
        this.store = { ...res[0].data, id: res[0].id };

        if (!this.store) {
          this.loadData = false;
          return;
        }

        this.setData();
        this.loadData = false;
      });
  }

  private setData(): void {
    this.back_color.setValue(this.store.back_color);
    this.border_color.setValue(this.store.border_color);
    this.footer_color.setValue(this.store.footer_color);
    this.menu_color.setValue(this.store.menu_color);
    this.name.setValue(this.store.name);
    this.navbar_color.setValue(this.store.navbar_color);
    this.slogan.setValue(this.store.slogan);
    this.email.setValue(this.store.email);
    this.celphone.setValue(this.store.celphone);
  }

  public saveStoreData(): void {
    if (this.f.invalid) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error con el formulario',
        'error'
      );
      return;
    }

    this.loadData = true;

    let data: IStore = {
      back_color: this.back_color.value,
      border_color: this.border_color.value,
      footer_color: this.footer_color.value,
      menu_color: this.menu_color.value,
      name: this.name.value,
      navbar_color: this.navbar_color.value,
      slogan: this.slogan.value,
      email: this.email.value,
      celphone: this.celphone.value,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    try {
      // Se guarda la info
      !this.store || !this.store.id
        ? this.shopsDataService.postDataFS(data).then(() => {
            alerts.basicAlert('Ok', 'Se han guardadao los datos', 'success');
            this.loadData = false;
          })
        : this.shopsDataService.patchDataFS(this.store.id, data).then(() => {
            alerts.basicAlert('Ok', 'Se han guardadao los datos', 'success');
            this.loadData = false;
          });
    } catch (error) {
      alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');
    }
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.categories)
      .toPromise()
      .then((res: any) => {});
  }
}
