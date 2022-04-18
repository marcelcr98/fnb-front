import { Injectable } from '@angular/core';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Financiamiento,
  Producto,
  FinanciamientoForm,
  FinanciamientoListInit
} from 'src/app/models/financiamiento.model';
import { Option } from '../../@core/models/option.model';
import { IPaginatorService } from 'src/app/@core/services/Ipaginator.service';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { AnulacionModel } from '../../models/anulacion.model';
import swal from 'sweetalert2';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoService implements IPaginatorService {
  controller = 'Financiamiento';

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {}

  init(cuentaContratoId: any, financiamientoId: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Financiamiento`;

    let params = new HttpParams();
    if (cuentaContratoId) {
      params = params.append('cuentaContratoId', cuentaContratoId);
    }

    if (financiamientoId) {
      params = params.append('financiamientoId', financiamientoId);
    }

    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  initList() {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<FinanciamientoListInit>>(url);
  }

  get(cuentaContratoId: any, financiamientoId: any): Observable<JsonResult<Financiamiento>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/init`;

    let params = new HttpParams();
    if (cuentaContratoId) {
      params = params.append('cuentaContratoId', cuentaContratoId);
    }

    if (financiamientoId) {
      params = params.append('financiamientoId', financiamientoId);
    }

    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  cargarProveedores(aliadoComercialId: number, canalVentaId: number): Observable<JsonResult<Option[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${aliadoComercialId}/${canalVentaId}/proveedores`;
    return this.http.get<JsonResult<Option[]>>(url);
  }

  cargarProductos(
    aliadoComercialId: number,
    proveedorId: number,
    canalVentaId: number,
    term: string
  ): Observable<JsonResult<Producto[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${aliadoComercialId}/${proveedorId}/${canalVentaId}/productos/${term}`;
    return this.http.get<JsonResult<Producto[]>>(url);
  }

  cargarAliadoProveedor(
    aliadoComercialId: number,
    canalVentaId: number,
    term: string
  ): Observable<JsonResult<AliadoComercial[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${aliadoComercialId}/${canalVentaId}/aliadoproveedor/${term}`;
    return this.http.get<JsonResult<AliadoComercial[]>>(url);
  }

  cargarComboProductos(aliadoComercialId: number, canalVentaId: number, term: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${aliadoComercialId}/${canalVentaId}/combos/${term}`;
    return this.http.get<JsonResult<any>>(url);
  }

  cargarVendedores(term: string): Observable<JsonResult<Option[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/vendedor/${term}`;
    return this.http.get<JsonResult<Option[]>>(url);
  }

  buscarUbigeo(nivel: number, ubigeoId: number): Observable<JsonResult<Option[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ubigeo`;

    let params = new HttpParams();
    params = params.append('nivel', nivel.toString());

    if (ubigeoId) {
      params = params.append('id', ubigeoId.toString());
    }

    return this.http.get<JsonResult<Option[]>>(url, { params: params });
  }

  buscarDireccion(cuentaCorriente: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getCuentaContrato/${cuentaCorriente}`;
    return this.http.get<JsonResult<any>>(url);
  }

  obtenerSedesAliado(aliadoComercialId: number): Observable<JsonResult<Option[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/sedes/${aliadoComercialId}`;
    return this.http.get<JsonResult<Option[]>>(url);
  }

  grabarFinanciamiento(financiamientoForm: FinanciamientoForm): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}`;
    return this.http.post<JsonResult<any>>(url, financiamientoForm);
  }

  procesarEntrega(financiamientoId: number, fechaEntrega: Date, nroBoleta: String): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${financiamientoId}/entrega`;

    const entregaDto = {
      financiamientoId: financiamientoId,
      fechaEntrega: fechaEntrega,
      nroBoleta: nroBoleta
    };
    return this.http.put<JsonResult<any>>(url, entregaDto);
  }

  imprimirFinanciamiento(nombreArchivo: string): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/imprimir/${nombreArchivo}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  exportarFinanciamiento(financiamiento: any): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/exportar`;
    return this.http.post(url, financiamiento, { responseType: 'blob' });
  }

  anularFinanciamiento(financiamiento: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/anular`;
    return this.http.put<JsonResult<any>>(url, financiamiento);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filtros}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getAll(paginator: any): Observable<JsonResult<PrimeTableResponse>> {
    throw new Error('Method not implemented.');
  }

  updateState(id: number, status: boolean): Observable<JsonResult<any>> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<JsonResult<any>> {
    throw new Error('Method not implemented.');
  }

  add(rowData: any) {
    swal({
      title: 'Implementar add',
      type: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000
    });
  }

  cancelFinanciamiento(entity: AnulacionModel): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/anular`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  addFinanciamiento(entity: Financiamiento): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}financiamiento`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  imprimirId(id: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Financiamiento/imprimirId/${id}`;

    return this.http.post<JsonResult<any>>(url, null);
  }

  getUploadedFile(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  updateFinanciamiento(entity: Financiamiento): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/updateFinanciamiento`;
    return this.http.post<JsonResult<any>>(url, entity);
  }
  tasaMensualFinanciamiento(): Observable<number> {
    const url = this._enviromentService.urlBaseServicios + 'Financiamiento/tasaMensualFinanciamiento';
    return this.http.get<number>(url);
  }
}
