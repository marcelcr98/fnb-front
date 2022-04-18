import { Component, OnInit } from '@angular/core';
import { ArchivoCargaService, UsuarioEdicionService } from '../../../services/feature.service.index';
import { UploadFile } from 'ngx-file-drop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUpload64 } from '../../../models/fileUpload64.model';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { AliadoComercialService, UsuarioService } from '../../../services/backend.service.index';
import swal from 'sweetalert2';
import { ProductoService } from 'src/app/services/backend/producto.service';
import { Option } from 'src/app/@core/models/option.model';
import { GlobalService } from 'src/app/services/global.service';
import { formatDate } from '@angular/common';

export interface Carga {
  value: string;
  valueName: string;
}

@Component({
  selector: 'app-carga-archivos',
  templateUrl: './carga-archivos.component.html',
  styles: []
})
export class CargaArchivosComponent implements OnInit {
  public files: UploadFile[] = [];
  archivoActual: string;
  archivo: string;
  estadoCarga: string;
  forma: FormGroup;
  base64: FileUpload64;
  valorMonto: number;
  showFecha: boolean;
  showAliado: boolean;
  optionCanalVenta: Option[];
  optionTurno: Option[];
  optionOpcion: Option[];
  optionAliados: Option[];
  cargas: Carga[] = [];
  setFecha = formatDate(new Date(), 'yyyy, MM, dd', 'en');
  minDate = new Date(this.setFecha);
  countRdn: number;
  idAliado: String;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _usuarioService: UsuarioService,
    public _productoService: ProductoService,
    public _archivoCargaService: ArchivoCargaService,
    public _aliadoComercialService: AliadoComercialService,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _global: GlobalService
  ) {
    this.countRdn = 1;
  }

  ngOnInit() {
    this.valorMonto = 2000;
    this.showFecha = false;
    this.showAliado = false;
    if (!this._global.isAdministradorWeb()) {
      this.idAliado = localStorage.getItem('IdAliado').toString();
    }

    this.forma = new FormGroup({
      tipoCarga: new FormControl('', Validators.required),
      credito: new FormControl('', [Validators.required, Validators.min(1)]),
      archivo: new FormControl('', Validators.required),
      fechaVencimiento: new FormControl(''),
      idHorario: new FormControl(''),
      idCanalVenta: new FormControl(''),
      idAliado: new FormControl(this.idAliado)
    });

    this.loadData();
    this.setTipoCargaArchivoValidators();
  }

  loadData() {
    this._archivoCargaService.initArchivo().subscribe(res => {
      this.optionCanalVenta = res.optionCanal;
      this.optionTurno = res.optionTurno;
      this.optionOpcion = res.optionOpcion;
      this.optionAliados = res.optionAliados;
    });
  }

  setTipoCargaArchivoValidators() {
    const fechaVencimientoCtrl = this.forma.get('fechaVencimiento');
    const horarioCtrl = this.forma.get('idHorario');
    const canalCtrl = this.forma.get('idCanalVenta');
    const idAliadoCtrl = this.forma.get('idAliado');
    const archivo = this.forma.get('archivo');
    this.forma.get('tipoCarga').valueChanges.subscribe(tipoCargaArchivo => {
      fechaVencimientoCtrl.reset();
      horarioCtrl.reset();
      canalCtrl.reset();
      idAliadoCtrl.reset();
      document.getElementById('archivo').innerText = 'Ningún archivo seleccionado';
      archivo.reset();
      if (tipoCargaArchivo !== '1') {
        fechaVencimientoCtrl.setValidators(null);
        horarioCtrl.setValidators(null);
        canalCtrl.setValidators(null);
      } else {
        fechaVencimientoCtrl.setValidators([Validators.required]);
        horarioCtrl.setValidators([Validators.required]);
        canalCtrl.setValidators([Validators.required]);
      }
      if (tipoCargaArchivo === '2' || !this._global.isAdministradorWeb()) {
        idAliadoCtrl.setValidators(null);
        idAliadoCtrl.setValue(this.idAliado);
      } else {
        idAliadoCtrl.setValidators([Validators.required]);
      }
      fechaVencimientoCtrl.updateValueAndValidity();
      horarioCtrl.updateValueAndValidity();
      canalCtrl.updateValueAndValidity();
      idAliadoCtrl.updateValueAndValidity();
    });
  }

  change(event) {
    this.showFecha = false;
    if (event.value == 4) {
      const control = this.forma.get('credito');
      control.enable();
      document.getElementById('update').removeAttribute('disabled');
    } else {
      const control = this.forma.get('credito');
      if (control.enabled) {
        control.disable();
      }
      document.getElementById('update').removeAttribute('disabled');
    }
    if (event.value == 1) {
      this.showFecha = true;
    } else {
      document.getElementById('update').removeAttribute('disabled');
    }
   /* if (event.value == 2 || !this._global.isAdministradorWeb()) {
      this.showAliado = false;
    }
    */
    if (event.value == 2) {
      this.showAliado = false;
    }
    else {
      this.showAliado = true;
    }
  }

  onArchivoSeleccionado($event) {
    if ($event.target.files.length === 1) {
      document.getElementById('archivo').innerText = $event.target.files[0].name;
      this.archivoActual = $event.target.files[0].name;
      this.getBase64($event.target.files[0]);
      document.getElementById('archivo').style.color = '#7ccef3';
      $event.target.value = '';
    } else {
      document.getElementById('archivo').innerText = 'Ningún archivo seleccionado';
      document.getElementById('archivo').style.color = 'red';
    }
  }

  getBase64(file): string {
    let vm_r = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
      let fileBase64 = reader.result;
      fileBase64 = fileBase64.toString().split(',')[1];
      vm_r = fileBase64;

      document.getElementById('valor').innerText = vm_r;
      file = null;
    };
    return vm_r;
  }

  sendFile() {
    if (!this.forma.valid) {
      if (document.getElementById('valor').innerText.toString() == '') {
        document.getElementById('archivo').style.color = 'red';
      }
      return;
    }

    this.base64 = {};
    this.base64.id = localStorage.getItem('id').toString();
    this.base64.Base64 = this.forma.value.archivo = document.getElementById('valor').innerText.toString();
    this.base64.monto = parseInt(this.forma.value.credito, 10);
    this.base64.tipoCargaArchivo = parseInt(this.forma.value.tipoCarga, 10);
    this.base64.idAliadoComercial = +this.forma.value.idAliado;
    this.base64.nombreArchivo=document.getElementById('archivo').innerText 
    if (this.forma.value.tipoCarga == 1) {
      this.base64.fechaVencimiento = this.forma.value.fechaVencimiento;
      this.base64.idHorario = this.forma.value.idHorario;
      this.base64.idCanalVenta = this.forma.value.idCanalVenta;
      this.sendFileProducto(this.base64);
    } else {
      this._archivoCargaService.sendFilePost(this.base64);
    }
  }

  sendFileProducto(base64: FileUpload64) {
    swal({
      title: 'Carga de Archivos',
      text: '¿Desea confirmar la carga?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._usuarioService.loadExcel(base64);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal(
              'Archivo subido correctamente!',
              '<div class="alert_content">' +
                '<i class="far fa-check-circle"></i> ' +
                response.data.toString().split('.')[0] +
                '<br>' +
                '<i class="far fa-check-circle"></i> ' +
                response.data.toString().split('.')[1] +
                '<br>' +
                '<i class="far fa-check-circle"></i>' +
                response.data.toString().split('.')[2] +
                '<br>' +
                '<i class="far fa-times-circle"></i>' +
                response.data.toString().split('.')[3] +
                '</div>',
              'success'
            );
            this.forma.get('tipoCarga').setValue(0);
          }
        });
      }
    });
    return this.estadoCarga;
  }
  changeCanales(event){   
   this._archivoCargaService.getRolCanalVenta(event.value).subscribe(e=>{
     this.optionCanalVenta=e;
   })
  }
}
