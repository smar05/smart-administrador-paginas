import { Component, Inject, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { UntypedFormBuilder } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { EnumOrderProcessStatus } from 'src/app/interface/iorders';
import { EnumSalesStatus } from 'src/app/interface/isales';
import { alerts } from './../../../../helpers/alerts';
import {
  EnumOrderStatus,
  IorderProcess,
  Iorders,
} from './../../../../interface/iorders';
import { Isales } from './../../../../interface/isales';
import { OrdersService } from './../../../../services/orders.service';
import { SalesService } from './../../../../services/sales.service';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.css'],
})
export class EditOrdersComponent implements OnInit {
  // Grupo de controlers
  public f = this.form.group({
    process: [],
  });

  get process() {
    return this.f.controls.process;
  }

  public processOrder: IorderProcess[] = []; // VIsualizar el proceso de la orden
  public newNextProcess: IorderProcess[] = [
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' },
  ];
  public loadData: boolean = false;
  public formSubmitted: boolean = false; // Valida envio de formulario
  public order: Iorders;

  constructor(
    private form: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private ordersService: OrdersService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.ordersService
      .getItemFS(this.data.id, qf)
      .toPromise()
      .then((resp: IFireStoreRes) => {
        this.processOrder = JSON.parse(resp.data.process);
        this.order = { id: resp.id, ...resp.data };

        //Guardar la edicion de entrega si el producto aun no se ha enviado
        if (this.processOrder[1].status == EnumOrderProcessStatus.pending) {
          this.processOrder.splice(2, 1);
        }

        this.process.setValue(JSON.parse(resp.data.process));
      });
  }

  public editOrder(): void {
    this.formSubmitted = true;

    if (this.f.invalid) return;

    this.loadData = true;

    // Se agrega la informacion a subir a bd
    this.f.controls.process.value.map((item: any, index: number) => {
      if (this.newNextProcess[index]['status'] != '') {
        item['status'] = this.newNextProcess[index]['status'];
      }
      if (this.newNextProcess[index]['comment'] != '') {
        item['comment'] = this.newNextProcess[index]['comment'];
      }
      if (this.newNextProcess[index]['date'] != '') {
        item['date'] = this.newNextProcess[index]['date'];
      }

      return item;
    });

    if (
      this.f.controls.process.value[0].status === EnumOrderProcessStatus.ok &&
      this.f.controls.process.value[1].status != EnumOrderProcessStatus.ok
    ) {
      this.f.controls.process.value[1].status = EnumOrderProcessStatus.pending;
    }
    if (
      this.f.controls.process.value[1].status === EnumOrderProcessStatus.ok &&
      this.f.controls.process.value[2].status != EnumOrderProcessStatus.ok
    ) {
      this.f.controls.process.value[2].status = EnumOrderProcessStatus.pending;
    }

    // Si es la ultima parte del proceso
    let status: string = '';

    if (this.newNextProcess[2]['status'] == EnumOrderProcessStatus.ok) {
      status = EnumOrderStatus.delivered;

      //Se trae la venta relacionada a la orden
      let qf: QueryFn = (ref) =>
        ref
          .where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId))
          .where('id_order', '==', this.data.id)
          .limit(1);

      this.salesService
        .getDataFS(qf)
        .toPromise()
        .then((resp: IFireStoreRes[]) => {
          let idSale: string = resp[0].id;
          let body: Isales = resp[0].data;
          body.status = EnumSalesStatus.success;

          //Cambiar el estado de la venta
          this.salesService.patchDataFS(idSale, body).then(() => {});
        });
    } else {
      status = EnumOrderStatus.pending;
    }

    let dataOrders: Iorders = this.order;
    delete dataOrders.id;
    dataOrders.status = status;
    dataOrders.process = JSON.stringify(this.f.controls.process.value);

    // Guardar en bd
    this.ordersService.patchDataFS(this.data.id, dataOrders).then(
      () => {
        this.loadData = false;
        this.dialogRef.close('save');
        alerts.basicAlert('Ok', 'La orden ha ido guardada', 'success');
      },
      (err: any) => {
        this.loadData = false;
        alerts.basicAlert(
          'Error',
          'Error al guardar la orden, se ha enviado un correo al comprador',
          'error'
        );
      }
    );
  }

  /**
   * Recoger informacion al cambiar el proceso
   *
   * @param {*} type
   * @param {*} item
   * @param {number} index
   * @memberof EditOrdersComponent
   */
  public changeProcess(type: any, item: any, index: number): void {
    this.newNextProcess[index][type] = item.value;
  }
}
