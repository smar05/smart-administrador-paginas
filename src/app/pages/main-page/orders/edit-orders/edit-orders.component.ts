import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { alerts } from './../../../../helpers/alerts';
import { Iorders, EnumOrderStatus } from './../../../../interface/iorders';
import { OrdersService } from './../../../../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EnumOrderProcessStatus } from 'src/app/interface/iorders';

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

  public processOrder: any[] = []; // VIsualizar el proceso de la orden
  public newNextProcess: any[] = [
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' },
  ];
  public loadData: boolean = false;
  public formSubmitted: boolean = false; // Valida envio de formulario

  constructor(
    private form: FormBuilder,
    public dialogRef: MatDialogRef<EditOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.ordersService.getItem(this.data.id).subscribe((resp: any) => {
      this.processOrder = JSON.parse(resp.process);

      //Guardar la edicion de entrega si el producto aun no se ha enviado
      if (this.processOrder[1].status == EnumOrderProcessStatus.pending) {
        this.processOrder.splice(2, 1);
      }

      this.process.setValue(JSON.parse(resp.process));
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

    // Si es la ultima parte del proceso
    let status: string = '';

    if (this.newNextProcess[2]['status'] == EnumOrderProcessStatus.ok) {
      status = EnumOrderStatus.delivered;
    } else {
      status = EnumOrderStatus.pending;
    }

    let dataOrders: Iorders = {
      status: status,
      process: JSON.stringify(this.f.controls.process.value),
    };

    // Guardar en bd
    this.ordersService.patchData(this.data.id, dataOrders).subscribe(
      (resp: any) => {
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
