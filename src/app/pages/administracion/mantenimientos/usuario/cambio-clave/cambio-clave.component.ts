import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioEdicionService } from 'src/app/services/feature.service.index';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styles: []
})
export class CambioClaveComponent implements OnInit {
  usuarioActual: Usuario;
  forma: FormGroup;

  constructor(
    public _usuarioEdicionService: UsuarioEdicionService,
    public _activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<CambioClaveComponent>
  ) {}

  btnCerrar(): void {
    this.dialogRef.close();
  }

  public get confirmPasswordMismatch() {
    return (
      (this.forma.get('password').dirty || this.forma.get('confirmPassword').dirty) &&
      this.forma.hasError('confirmedDoesNotMatch')
    );
  }
  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.forma = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(ExpressionValidation.PassWord)]),
      newRePassword: new FormControl('', Validators.required)
    });
  }

  onInput(value) {
    if (value != null && value != this.forma.get('newPassword').value) {
      this.forma.get('newRePassword').setErrors([{ confirmedDoesNotMatch: true }]);
    } else {
      this.forma.get('newRePassword').setErrors(null);
    }
  }

  enviar() {
    if (this.forma.invalid) {
      return;
    }
    this.forma.value.oldpassword = this.forma.value.password;
    this.forma.value.password = this.forma.value.newPassword;
    this.forma.value.intentos = '99';
    this._usuarioEdicionService.updatePassword(this.forma.value);
    this.dialogRef.close();
  }
}
