import { functions } from './../../../../helpers/functions';
import { alerts } from './../../../../helpers/alerts';
import {
  Imessages,
  EnumMessagesStatus,
} from './../../../../interface/imessages';
import { MessageService } from './../../../../services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

export interface IDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-messages',
  templateUrl: './edit-messages.component.html',
  styleUrls: ['./edit-messages.component.css'],
})
export class EditMessagesComponent implements OnInit {
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
  public loadData: boolean = false;
  public formSubmitted: boolean = false; // Valida envio de formulario

  constructor(
    private form: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    let qf: QueryFn = (ref) =>
      ref.where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId));

    this.messageService
      .getItemFS(this.data.id, qf)
      .toPromise()
      .then((resp: IFireStoreRes) => {
        this.message = resp.data.message;
        this.answer.setValue(resp.data.answer);
      });
  }

  public editMessage(): void {
    this.formSubmitted = true;

    if (this.f.invalid) return;

    this.loadData = true;

    let dataMessage: Imessages = {
      answer: this.f.controls.answer.value,
      date_answer: new Date(),
      status: EnumMessagesStatus.answered,
      idShop: localStorage.getItem(EnumLocalStorage.localId),
    };

    // Guardar en bd
    this.messageService.patchDataFS(this.data.id, dataMessage).then(
      () => {
        this.loadData = false;
        this.dialogRef.close('save');
        alerts.basicAlert('Ok', 'El mensaje ha sido guardada', 'success');
      },
      (err: any) => {
        this.loadData = false;
        alerts.basicAlert(
          'Error',
          'Error al guardar el mensaje, se ha enviado un correo al comprador',
          'error'
        );
      }
    );
  }

  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
