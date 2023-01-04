import { OrdersService } from './../../../../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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
  public f = this.form.group({});
  public processOrder: any[] = []; // VIsualizar el proceso de la orden
  public loadData: boolean = false;
  public formSubmitted: boolean = false; // Valida envio de formulario

  constructor(
    private form: FormBuilder,
    public dialogRef: MatDialogRef<EditOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.ordersService.getItem(this.data.id).subscribe((resp: any) => {
      this.processOrder = JSON.parse(resp.process);
    });
  }

  public editOrder(): void {
    this.formSubmitted = true;

    if (this.f.invalid) return;

    this.loadData = true;
  }
}
