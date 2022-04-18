import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioEdicionService } from 'src/app/services/feature/Administracion/Usuario/usuario-edicion.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioListadoService } from 'src/app/services/feature.service.index';
import { UsuarioService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-edicion-usuario',
  templateUrl: './usuario-edicion.component.html',
  styles: []
})

export class UsuarioEdicionComponent implements OnInit {
  showPassword: boolean;
  usuarioActual: Usuario;
  forma: FormGroup;
  rolControl: FormControl;
  aliadoComercialId: number;
  disabledAliadoComercial: boolean;
  formGroup: FormGroup;
  constructor(
    public _usuarioServicio: UsuarioService,
    public _usuarioListadoService: UsuarioListadoService,
    public _activatedRoute: ActivatedRoute,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _renderer2: Renderer2
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._usuarioEdicionServicio.init(this._activatedRoute).subscribe(response => {
      this.usuarioActual = response;
      this.aliadoComercialId = response.aliadoComercialId;
      this.disabledAliadoComercial = response.rolLogueadoId == 1 ? false : true;
      this.forma = this._usuarioEdicionServicio.getForm(this.usuarioActual);
      this.rolControl = this.forma.get('rolId') as FormControl;
      if (Number.isInteger(this.usuarioActual.id) && this.usuarioActual.id == 0) {
        this.forma.get('userName').setValue('');
        this.forma.get('password').setValue('');
      }
    });
  }

  onSubmit() {
    if (this.forma.valid) {
      this._usuarioEdicionServicio.saveChange(this.forma.getRawValue());
    }
  }

  cancelar() {
    this._usuarioEdicionServicio.cancel();
  }

  aliadoChange(event: any) {
    this.cargarSedes(event);
  }






  cargarSedes(event: any) {
    if (event.value != null) {
      this._usuarioEdicionServicio.initSede(event.value).subscribe(res => {
        this.usuarioActual.sedes = res.optionSede;
      });
    } else {
      this.usuarioActual.sedes = null;
    }
  }





  rolChange(event: any) {
    const aliado = this.forma.get('aliadoComercialId');
    const sede = this.forma.get('sedeId');

    if (!aliado.value) {
      this.usuarioActual.sedes = null;
    }

    if (event.value == 1) {
      this.forma.controls['aliadoComercialId'].setValue(null);
      this.forma.controls['sedeId'].setValue(null);
      aliado.clearValidators();
      aliado.updateValueAndValidity();
      sede.clearValidators();
      sede.updateValueAndValidity();
    }
    if (event.value == 2) {
      this.forma.controls['sedeId'].setValue(null);
      aliado.setValidators([Validators.required]);
      sede.clearValidators();
      sede.updateValueAndValidity();
    }
    if (event.value > 2) {
      aliado.setValidators([Validators.required]);
      sede.setValidators([Validators.required]);
    }
  }
  changeTipoDocumento(value: string) {
    this._usuarioEdicionServicio.validadNroDocumento(this.forma, value);
  }
}
