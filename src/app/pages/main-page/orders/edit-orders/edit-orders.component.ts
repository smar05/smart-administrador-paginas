import { Isales } from './../../../../interface/isales';
import { IQueryParams } from './../../../../interface/i-query-params';
import { SalesService } from './../../../../services/sales.service';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { alerts } from './../../../../helpers/alerts';
import { Iorders, EnumOrderStatus } from './../../../../interface/iorders';
import { OrdersService } from './../../../../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { EnumOrderProcessStatus } from 'src/app/interface/iorders';
import { EnumSalesStatus } from 'src/app/interface/isales';

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

      //Se trae la venta relacionada a la orden
      let params: IQueryParams = {
        orderBy: '"id_order"',
        equalTo: `"${this.data.id}"`,
      };
      this.salesService.getData(params).subscribe((resp: any[]) => {
        let idSale: string = Object.keys(resp)[0];

        let body: Isales = {
          status: EnumSalesStatus.success,
        };

        //Cambiar el estado de la venta
        this.salesService.patchData(idSale, body).subscribe((resp2: any) => {});
      });
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
