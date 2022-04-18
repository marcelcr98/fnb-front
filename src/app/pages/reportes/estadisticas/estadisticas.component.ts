import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeTable, Column } from '../../../@core/models/prime-table.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { EstadisticasListInit } from '../../../models/estadistica.model';
import { formatDate } from '@angular/common';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { EstadisticasListadoService } from 'src/app/services/feature.service.index';
import { LazyLoadEvent } from 'primeng/primeng';
import { EstadisticaService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styles: []
})
export class EstadisticasComponent implements OnInit {
  @ViewChild('dt', { static: true })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  estadisticasListInit: EstadisticasListInit;
  dateStart: Date;
  dateEnd: Date;
  fechaCreacionMin: Date;
  fechaCreacionMax: Date;
  dateRangeSel: Date[];

  totalConsultas: number;
  totalConsultasConVentas: number;
  totalConsultasSinVentas: number;

  totalPorcentajeConsultas: number;
  totalPorcentajeConsultasConVentas: number;
  totalPorcentajeConsultasSinVentas: number;

  public idAliadoComercial: string = null;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _estadisticasListadiService: EstadisticasListadoService,
    public _estadisticasService: EstadisticaService,
    public _global: GlobalService
  ) {
    this.totalConsultas = 0;
    this.totalConsultasConVentas = 0;
    this.totalConsultasSinVentas = 0;

    this.totalPorcentajeConsultas = 100;
    this.totalPorcentajeConsultasConVentas = 0;
    this.totalPorcentajeConsultasSinVentas = 0;
  }

  ngOnInit() {
    this.dataEntity = this.init(this.dataTable);
    this.estadisticasListInit = this._estadisticasListadiService.getListasIniciales();
    this._estadisticasListadiService.callbackInitAsync().subscribe(response => {
      this.estadisticasListInit = response;

      this.totalConsultas = this.estadisticasListInit.totalConsulta;
      this.totalConsultasConVentas = this.estadisticasListInit.totalConsultaVenta;
      this.totalConsultasSinVentas = this.estadisticasListInit.totalConsultaSinVentas;

      this.totalPorcentajeConsultas = this.estadisticasListInit.porcentajeConsulta;
      this.totalPorcentajeConsultasConVentas = this.estadisticasListInit.porcentajeConsultaVentas;
      this.totalPorcentajeConsultasSinVentas = this.estadisticasListInit.porcentajeConsultaSinVentas;

      if (!this._global.isAdministradorWeb()) {
        this.idAliadoComercial = localStorage.getItem('IdAliado').toString();
        this.dataTable.filter(this.idAliadoComercial, 'aliadoComercialId', 'equals');
      }
    });
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._estadisticasListadiService.getConfigTable());
  }

  change(event, dataTable: any) {
    if (event.value) {
      this._estadisticasListadiService
        .obtenerSedesAliado(event.value)
        .subscribe(response => (this.estadisticasListInit.sede = response));
    }
    dataTable.filter(event.value, 'aliadoComercialId', 'equals');
  }

  filterFechaCreacionMin(event) {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    const formattedDate = formatDate(this.fechaCreacionMin, format, locale);

    this.dataTable.filter(formattedDate, 'fechaInicio', 'GreatherThanOrEqual');
  }

  filterFechaCreacionMax(event) {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    const formattedDate = formatDate(this.fechaCreacionMax, format, locale);

    this.dataTable.filter(formattedDate, 'fechaFin', 'LessThanOrEqual');
  }

  filterHoraInicio() {
    const format = 'HH:mm';
    const locale = 'en-US';
    let formattedDate = null;
    if (this.dateStart) {
      formattedDate = formatDate(this.dateStart, format, locale);
    }
    this.dataTable.filter(formattedDate, 'horaInicio', 'GreatherThanOrEqual');
  }

  filterHoraFin() {
    const format = 'HH:mm';
    const locale = 'en-US';
    let formattedDate = null;
    if (this.dateEnd) {
      formattedDate = formatDate(this.dateEnd, format, locale);
    }
    this.dataTable.filter(formattedDate, 'horaFin', 'LessThanOrEqual');
  }

  dateRangeSelect(range) {
    this.dataTable.filter(this.getFechaString(range[0]), 'fechaInicio', 'GreatherThanOrEqual');
    this.dataTable.filter(this.getFechaString(range[1]), 'fechaFin', 'LessThanOrEqual');
  }

  getFechaString(date: Date): string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date, format, locale);
  }

  obtenerTotalConsultas(): number {
    if (!!this.dataTable.dataEntity) {
      if (!!this.dataTable.dataEntity.data && this.dataTable.dataEntity.data.length > 0) {
        this.totalConsultas = this.dataTable.dataEntity.data[0].total;
      } else {
        this.totalConsultas = 0;
      }
    } else {
      this.totalConsultas = 0;
    }
    return this.totalConsultas;
  }

  obtenerTotalConsultasConVentas(): number {
    if (!!this.dataTable.dataEntity) {
      if (!!this.dataTable.dataEntity.data && this.dataTable.dataEntity.data.length > 0) {
        this.totalConsultasConVentas = this.dataTable.dataEntity.data[0].totalVenta;
      } else {
        this.totalConsultasConVentas = 0;
      }
    } else {
      this.totalConsultasConVentas = 0;
    }
    return this.totalConsultasConVentas;
  }

  obtenerTotalConsultasSinVentas(): number {
    if (!!this.dataTable.dataEntity) {
      if (!!this.dataTable.dataEntity.data && this.dataTable.dataEntity.data.length > 0) {
        this.totalConsultasSinVentas =
          this.dataTable.dataEntity.data[0].total - this.dataTable.dataEntity.data[0].totalVenta;
      } else {
        this.totalConsultasSinVentas = 0;
      }
    } else {
      this.totalConsultasSinVentas = 0;
    }
    return this.totalConsultasSinVentas;
  }

  obtenerPorcentajeTotalConsultas(): number {
    return this.totalPorcentajeConsultas;
  }

  obtenerPorcentajeTotalConsultasConVentas(): number {
    if (!!this.dataTable.dataEntity) {
      if (!!this.dataTable.dataEntity.data && this.dataTable.dataEntity.data.length > 0) {
        this.totalPorcentajeConsultasConVentas = Math.round((this.totalConsultasConVentas / this.totalConsultas) * 100);
      } else {
        this.totalPorcentajeConsultasConVentas = 0;
      }
    } else {
      this.totalPorcentajeConsultasConVentas = 0;
    }
    return this.totalPorcentajeConsultasConVentas;
  }

  obtenerPorcentajeTotalConsultasSinVentas(): number {
    if (!!this.dataTable.dataEntity) {
      if (!!this.dataTable.dataEntity.data && this.dataTable.dataEntity.data.length > 0) {
        this.totalPorcentajeConsultasSinVentas = Math.round((this.totalConsultasSinVentas / this.totalConsultas) * 100);
      } else {
        this.totalPorcentajeConsultasSinVentas = 0;
      }
    } else {
      this.totalPorcentajeConsultasSinVentas = 0;
    }
    return this.totalPorcentajeConsultasSinVentas;
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    this._estadisticasService.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }
}
