import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { ConsultaCreditoService } from '../../../services/feature.service.index';
import { Option } from '../../../@core/models/option.model';
import { OptionToggle } from 'src/app/models/optionToggle.model';

//--
import { MatDialog } from '@angular/material/dialog';
import { VerConsumoComponent } from '../consulta-credito/ver-consumo.component';
import swal from 'sweetalert2';
//--

@Component({
  selector: 'app-consulta-credito',
  templateUrl: './consulta-credito.component.html',
  styles: []
})
export class ConsultaCreditoComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: Table;
  dnicuenta: string;
  eventT: LazyLoadEvent;
  lineaCredito: string;
  showBusqueda = false;
  EsRolVendedor = true;
  dataCliente: any;
  ctasContrato: any[];
  permisoConsultarCredito: boolean;
  tipoDocumento: string;
  lenghtValidacion: number;
  optionTiposDocumento: Option[];
  tipoValidacion: string;
  visibctive:boolean=false;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _global: GlobalService,
    public _consultaCreditoService: ConsultaCreditoService,
    //--
    public dialog: MatDialog
  ) //--
  {}

  ngOnInit() {
    this.permisoConsultarCredito = this._global.validarPermiso('BUSCRE');
    this._consultaCreditoService.init().subscribe(response => {
      this.optionTiposDocumento = response.tiposDocumento;
    });
  }

  goToFinanciamiento(id: number, consulta: number) {
    this._consultaCreditoService.redirectFinanciamiento(id, consulta);
  }

  onSearch(form: NgForm) {
    this._consultaCreditoService.consultaCredito(form.value.dnicuenta, form.value.tipoDocumento).subscribe(response => {
      this.lineaCredito = response.lineaCredito;
      this.dataCliente = response;
      this.ctasContrato = response.cuentasContrato;

      if(this.ctasContrato.length==0)
      {
        swal({
          title: `Cliente no Encontrado`,
          type: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        this.visibctive = false;
      }else{
        this.visibctive = true;
      }
    });
  }

  changeTipoDoc(_event: any) {
    this.tipoDocumento = _event.value;
    switch (this.tipoDocumento) {
      case 'Z001':
        this.tipoValidacion = '^[0-9]+$';
        this.lenghtValidacion = 8;
        break;
      case 'Z002':
      case 'Z003':
        this.tipoValidacion = '^$|^[A-Za-z0-9]+';
        this.lenghtValidacion = 12;
        break;
    }
  }
  //--
  verConsumo(form: NgForm) {
    this.dnicuenta = form.value.dnicuenta;
    this.tipoDocumento = form.value.tipoDocumento;

    const dialogRef = this.dialog.open(VerConsumoComponent, {
      width: '600px',
      data: {
        Documento: this.dnicuenta,
        TipoDocumento: this.tipoDocumento
      }
    });
  }
  //--
}
