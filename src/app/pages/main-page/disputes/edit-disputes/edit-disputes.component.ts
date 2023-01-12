import { functions } from './../../../../helpers/functions';
import { alerts } from './../../../../helpers/alerts';
import { Idisputes } from './../../../../interface/idisputes';
import { DisputesService } from './../../../../services/disputes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

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
    this.disputesService.getItem(this.data.id).subscribe((resp: any) => {
      this.message = resp.message;
      this.answer.setValue(resp.answer);
      this.dataOrder = resp.order;
    });
  }

  public editDispute(): void {
    this.formSubmitted = true;

    if (this.f.invalid) return;

    this.loadData = true;

    let dataDispute: Idisputes = {
      answer: this.f.controls.answer.value,
      date_answer: new Date(),
    };

    // Guardar en bd
    this.disputesService.patchData(this.data.id, dataDispute).subscribe(
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
