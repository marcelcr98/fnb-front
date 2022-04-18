import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { FinanciamientoListadoService, FinanciamientoEdicionService } from '../../../services/feature.service.index';
import { FinanciamientoListInit } from '../../../models/financiamiento.model';
import { GlobalService } from '../../../services/global.service';
import { formatDate } from '@angular/common';
import { Option } from '../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { LazyLoadEvent } from 'primeng/primeng';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financiamientos',
  templateUrl: './financiamientos.component.html',
  styles: []
})
export class FinanciamientosComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTablev2: Table;

  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  financiamientoInit: FinanciamientoListInit;
  tipoDocumento: string;
  tipoValidacion: string;
  lenghtValidacion: number;
  

  fechaFinanciamientoVenta: Date;
  fechaFinanciamientoEntrega: Date;


  ViewUserResto: string;
  ViewUserVendedor: string;
  idAliadoComercial: string = null;
  idSede: string = null;
  showExportar = this._global.validarPermiso('EXPFIN');
  rol: string;
  NombreCompleto: string;
  filteredOptions: Observable<Option[]>;
  formGroup: FormGroup;
  getItemForm: any;
  EsProveedor: boolean;
  hasSede: boolean;

  constructor(
    public _financiamientoListadoService: FinanciamientoListadoService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public _financiamientoService: FinanciamientoService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute
  ) {
    if (localStorage.getItem('EsProveedor')) {
      localStorage.removeItem('EsProveedor');
    }
  }

  
  async ngOnInit() {
    this.formGroup = this._financiamientoEdicionService.newForm();
    this.setearDatos();
    this.dataEntity = this.init(this.dataTable);
    const response = await this._financiamientoListadoService.initAsync(this.dataTablev2).toPromise();
    this.financiamientoInit = response;

    this.EsProveedor = response.proveedores.find((x) => x.value == localStorage.getItem('IdAliado'));

    if (this.EsProveedor) {
      localStorage.setItem('EsProveedor', '1');
    }

    this.rol = localStorage.getItem('RolUsuario');

    if (this.rol == 'Vendedor' || this.rol == 'Call Center' || this.rol == 'CSC') {
      this.ViewUserResto = 'd-none';
      this.ViewUserVendedor = 'd-block';
      this.NombreCompleto = localStorage.getItem('NombreyApellidos');
      this.filterVendedor(this.NombreCompleto);
    } else {
      this.ViewUserResto = 'd-block';
      this.ViewUserVendedor = 'd-none';
      this.filteredOptions = this.formGroup.get('vendedor').valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this._financiamientoEdicionService.obtenerListaVendedores(value))
      );
    }

    if (!this._global.isAdministradorWeb()) {
      this.idAliadoComercial = localStorage.getItem('IdAliado').toString();

      if (this.EsProveedor) {
        this.formGroup.get('proveedorId').setValue(this.idAliadoComercial);
        this.dataTable.filter(this.idAliadoComercial, 'proveedorId', 'equals');
      } else {
        this.formGroup.get('aliadoId').setValue(this.idAliadoComercial);
        this.dataTable.filter(this.idAliadoComercial, 'aliadoComercialId', 'equals');
      }

      if (localStorage.getItem('IdSede').toString() !== 'null') {
        this.idSede = localStorage.getItem('IdSede').toString();
        this.hasSede = true;
        this.formGroup.get('sedeId').setValue(this.idSede);
        this.formGroup.get('aliadoId').setValue(this.idAliadoComercial);

        this.dataTable.filter(this.idAliadoComercial, 'aliadoComercialId', 'equals');
        this.dataTable.filter(this.idSede, 'sedeId', 'equals');
      }
    }

    if (this._global.isAdministradorWeb()) {
      let respVentaId = this.formGroup.get('aliadoId').value;
      if (respVentaId) {
        this._financiamientoListadoService.callbackInitAsync().subscribe((response) => {
          this.financiamientoInit = response;
          this._financiamientoListadoService.obtenerSedesAliado(respVentaId).subscribe((sedes) => {
            this.financiamientoInit.sedes = sedes;
          });
        });
      }
    }
  }

  setearDatos() {
    if (!this._rutaActiva.snapshot.paramMap.get('id')) {
      localStorage.removeItem('getItemForm');
    }
    this.getItemForm = JSON.parse(localStorage.getItem('getItemForm'));
    if (this.getItemForm) {
      for (let key in this.getItemForm) {
        this.formGroup.get(key).setValue(this.getItemForm[key]);
      }
    }
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._financiamientoListadoService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    // if (Object.entries(primerNgFilter.filters).length === 0) {
    if (this.getItemForm) {
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const filters = {
        estado: { value: this.formGroup.get('estado').value, matchMode: 'equals' },
        fechaVenta: {
          value: this.formGroup.get('fechaVenta').value
            ? formatDate(this.formGroup.get('fechaVenta').value, format, locale)
            : '',
          matchMode: 'equals',
        },
        nroContrato: { value: this.formGroup.get('nroContrato').value, matchMode: 'contains' },
        aliadoComercialId: { value: this.formGroup.get('aliadoId').value, matchMode: 'equals' },
        proveedorId: { value: this.formGroup.get('proveedorId').value, matchMode: 'equals' },
        tipoDocumento: { value: this.formGroup.get('tipoDocumento').value, matchMode: 'equals' },
        nroDocumento: { value: this.formGroup.get('nroDocumento').value, matchMode: 'contains' },
        idCategoria: { value: this.formGroup.get('idCategoria').value, matchMode: 'equals' },
        canalVentaId: { value: this.formGroup.get('canalId').value, matchMode: 'equals' },
        fechaEntrega: {
          value: this.formGroup.get('fechaEntrega').value
            ? formatDate(this.formGroup.get('fechaEntrega').value, format, locale)
            : '',
          matchMode: 'equals',
        },
        nroPedido: { value: this.formGroup.get('nroPedido').value, matchMode: 'contains' },
        sedeId: { value: this.formGroup.get('sedeId').value, matchMode: 'equals' },
        vendedor: { value: this.formGroup.get('vendedor').value.label, matchMode: 'Equals' },
      };
      if (this.formGroup.get('estado').value === undefined || this.formGroup.get('estado').value.trim() === '') {
        delete filters['estado'];
      }
      if (this.formGroup.get('fechaVenta').value === null || this.formGroup.get('fechaVenta').value.length === 0) {
        delete filters['fechaVenta'];
      }
      if (this.formGroup.get('nroContrato').value === null || this.formGroup.get('nroContrato').value.trim() === '') {
        delete filters['nroContrato'];
      }
      if (this.formGroup.get('aliadoId').value === undefined || this.formGroup.get('aliadoId').value.trim() === '') {
        delete filters['aliadoComercialId'];
      }
      if (
        this.formGroup.get('proveedorId').value === undefined ||
        this.formGroup.get('proveedorId').value.trim() === ''
      ) {
        delete filters['proveedorId'];
      }
      if (
        this.formGroup.get('tipoDocumento').value === undefined ||
        this.formGroup.get('tipoDocumento').value.trim() === ''
      ) {
        delete filters['tipoDocumento'];
      }
      if (this.formGroup.get('nroDocumento').value === null || this.formGroup.get('nroDocumento').value.trim() === '') {
        delete filters['nroDocumento'];
      }
      if (
        this.formGroup.get('idCategoria').value === undefined ||
        this.formGroup.get('idCategoria').value.length === 0
      ) {
        delete filters['idCategoria'];
      }
      if (this.formGroup.get('canalId').value === undefined || this.formGroup.get('canalId').value.trim() === '') {
        delete filters['canalVentaId'];
      }
      if (this.formGroup.get('fechaEntrega').value === null || this.formGroup.get('fechaEntrega').value.length === 0) {
        delete filters['fechaEntrega'];
      }
      if (this.formGroup.get('nroPedido').value === null || this.formGroup.get('nroPedido').value.length === 0) {
        delete filters['nroPedido'];
      }
      if (this.formGroup.get('sedeId').value === undefined || this.formGroup.get('sedeId').value.length === 0) {
        delete filters['sedeId'];
      }
      if (this.formGroup.get('vendedor').value === null || this.formGroup.get('vendedor').value.length === 0) {
        delete filters['vendedor'];
      }
      if (filters) {
        primerNgFilter.filters = filters;
      }
    }

    this._financiamientoService.loadLazyFilter(primerNgFilter, '').subscribe((response) => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
    localStorage.setItem('getItemForm', JSON.stringify(this.formGroup.value));
  }

  exportar() {
    let obj = this.formGroup.getRawValue();
    this._financiamientoListadoService.exportarFinanciamiento(obj);
  }

  change(event: any) {
    if (event.value != null) {
      this.filtrarPorAliado(event.value);
    } else {
      this.financiamientoInit.sedes = null;
      this.dataTable.filter(null, 'sedeId', 'equals');
      this.dataTable.filter(null, 'aliadoComercialId', 'equals');
    }
  }

  changeProveedor(event: any) {
    if (event.value != null) {
      this.dataTable.filter(event.value, 'proveedorId', 'equals');
    } else {
      this.dataTable.filter(null, 'proveedorId', 'equals');
    }
  }

  async filtrarPorAliado(id: any) {
    if (this.financiamientoInit) {
      const response = await this._financiamientoListadoService.obtenerSedesAliado(id).toPromise();
      this.financiamientoInit.sedes = response;
      this.dataTable.filter(id, 'aliadoComercialId', 'equals');
    }
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

  filterVendedor(vendedor: string) {
    this.dataTable.filter(vendedor, 'vendedor', 'Equals');
  }

  filterFechaVenta(event) {
    if (event.value != null) {
      this.fechaFinanciamientoVenta = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoVenta, format, locale);
      this.dataTable.filter(formattedDate, 'fechaVenta', 'Equals');
    } else {
      this.dataTable.filter(null, 'fechaVenta', 'Equals');
    }
  }
  

  filterFechaEntrega(event) {
    if (event.value != null) {
      this.fechaFinanciamientoEntrega = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoEntrega, format, locale);
      this.dataTable.filter(formattedDate, 'fechaEntrega', 'Equals');
    } else {
      this.dataTable.filter(null, 'fechaEntrega', 'Equals');
    }
  }

  displayFn(vendedor: any) {
    if (vendedor) {
      return vendedor.label;
    }
  }
}
