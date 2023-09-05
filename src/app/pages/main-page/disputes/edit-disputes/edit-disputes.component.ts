import { functions } from './../../../../helpers/functions';
import { alerts } from './../../../../helpers/alerts';
import {
  EnumDisputesStatus,
  Idisputes,
} from './../../../../interface/idisputes';
import { DisputesService } from './../../../../services/disputes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-disputes',
  templateUrl: './edit-disputes.component.html',
  styleUrls: ['./edit-disputes.component.css'],
})
export class EditDisputesComponent implements OnInit {
  // Grupo de controlers
  public f = this.form.group({
    answer: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '[-\\(\\)\\-\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ]*'
        ),
      ],
    ],
  });

  get answer() {
    return this.f.controls.answer;
  }

  public message: string = '';
  public dataOrder: string = '';
  public loadData: boolean = false;
  public formSubmitted: boolean = false; // Valida envio de formulario
  public dispute: Idisputes;

  constructor(
    private form: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditDisputesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private disputesService: DisputesService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.disputesService
      .getItemFS(this.data.id)
      .toPromise()
      .then((resp: IFireStoreRes) => {
        this.message = resp.data.message;
        this.answer.setValue(resp.data.answer);
        this.dataOrder = resp.data.order;
        this.dispute = { id: resp.id, ...resp.data };
      });
  }

  public editDispute(): void {
    this.formSubmitted = true;

    if (this.f.invalid) return;

    this.loadData = true;

    let dataDispute: Idisputes = this.dispute;
    delete dataDispute.id;
    dataDispute.answer = this.f.controls.answer.value;
    dataDispute.date_answer = new Date();
    dataDispute.status = EnumDisputesStatus.answered;

    // Guardar en bd
    this.disputesService.patchDataFS(this.data.id, dataDispute).then(
      (resp: any) => {
        this.loadData = false;
        this.dialogRef.close('save');
        alerts.basicAlert('Ok', 'La disputa ha sido guardada', 'success');
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

  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
