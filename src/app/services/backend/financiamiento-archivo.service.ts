import { Injectable } from '@angular/core';
import { FinanciamientoArchivo } from 'src/app/models/financiamientoArchivo.model';
import { Service } from 'src/app/@core/services/service.service';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoArchivoService extends Service<FinanciamientoArchivo>{

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'financiamientoArchivo');
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  download(id: number): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/download/${id}`;
    return this.http.get(url);
  }
}
