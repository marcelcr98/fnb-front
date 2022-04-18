import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { TableModule } from 'primeng/table';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxMaskModule } from 'ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';

import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioListadoComponent } from './administracion/mantenimientos/usuario/usuario-listado/usuario-listado.component';
import { UsuarioEdicionComponent } from './administracion/mantenimientos/usuario/usuario-edicion/usuario-edicion.component';
import { CambioClaveComponent } from './administracion/mantenimientos/usuario/cambio-clave/cambio-clave.component';
import { ClienteListadoComponent } from './administracion/mantenimientos/cliente/cliente-listado/cliente-listado.component';
import { ClienteEdicionComponent } from './administracion/mantenimientos/cliente/cliente-edicion/cliente-edicion.component';
import { CargaArchivosComponent } from './administracion/carga-archivos/carga-archivos.component';
import { AliadosDashboardComponent } from './dashboard/aliados-dashboard/aliados-dashboard.component';
import { VentasDashboardComponent } from './dashboard/ventas-dashboard/ventas-dashboard.component';
import { PromocionesDashboardComponent } from './dashboard/promociones-dashboard/promociones-dashboard.component';
import { MensajePaginadorPipe } from '../pipes/mensaje-paginador.pipe';
import { PagingGridComponent } from '../components/paging-grid/paging-grid.component';
import { ConsultaCreditoComponent } from './operaciones/consulta-credito/consulta-credito.component';
import { FinanciamientosComponent } from './operaciones/financiamientos/financiamientos.component';
import { OrdenesDePagoComponent } from './reportes/ordenes-de-pago/ordenes-de-pago.component';
import { AgregarProductoComponent } from './operaciones/financiamientos/agregar-producto/agregar-producto.component';
import { ListaCargaComponent } from './administracion/mantenimientos/lista-carga/lista-carga.component';

import { VerConsumoComponent } from './operaciones/consulta-credito/ver-consumo.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AnularFinanciamientoComponent } from './operaciones/financiamientos/anular-financiamiento/anular-financiamiento.component';
import { PerfilesComponent } from './administracion/permisos/perfiles/perfiles.component';
import { CanalesComponent } from './administracion/permisos/canales/canales.component';
import { TreeTableModule, CalendarModule } from 'primeng/primeng';
import { FinanciamientoFormComponent } from './operaciones/financiamientos/financiamiento-form/financiamiento-form.component';
import { FinanciamientoDatosGeneralesComponent } from './operaciones/financiamientos/financiamiento-datos-generales/financiamiento-datos-generales.component';
import { FinanciamientoCreateComponent } from './operaciones/financiamientos/financiamiento-create/financiamiento-create.component';
import { FinanciamientoEditComponent } from './operaciones/financiamientos/financiamiento-edit/financiamiento-edit.component';
import { FinanciamientoCuotasComponent } from './operaciones/financiamientos/financiamiento-cuotas/financiamiento-cuotas.component';
import { FinanciamientoProductosComponent } from './operaciones/financiamientos/financiamiento-productos/financiamiento-productos.component';
import { FinanciamientoDespachoComponent } from './operaciones/financiamientos/financiamiento-despacho/financiamiento-despacho.component';
import { FinanciamientoDespachoEditComponent } from './operaciones/financiamientos/financiamiento-despacho-edit/financiamiento-despacho-edit.component';
import { SimuladorCuotasComponent } from './operaciones/financiamientos/simulador-cuotas/simulador-cuotas.component';
import { CorreosMantenimientoComponent } from './administracion/mantenimientos/correos/correos-mantenimiento.component';
import { EstadisticasComponent } from './reportes/estadisticas/estadisticas.component';
import { DashBoardStatsComponent } from '../components/dashboards/dashboard-stats.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FinanciamientoCombosComponent } from './operaciones/financiamientos/financiamiento-combos/financiamiento-combos.component';
import { CommercialAllyIndexComponent } from './administracion/mantenimientos/commercial-ally/commercial-ally-index/commercial-ally-index.component';
import { CommercialAllyFormComponent } from './administracion/mantenimientos/commercial-ally/commercial-ally-form/commercial-ally-form.component';
import { CategoryIndexComponent } from './administracion/mantenimientos/category/category-index/category-index.component';
import { CategoryFormComponent } from './administracion/mantenimientos/category/category-form/category-form.component';
import { EmailSenderComponent } from './operaciones/financiamientos/email-sender/email-sender.component';
import { BranchOfficeIndexComponent } from './administracion/mantenimientos/branch-office/branch-office-index/branch-office-index.component';
import { BranchOfficeFormComponent } from './administracion/mantenimientos/branch-office/branch-office-form/branch-office-form.component';
import { EncuestaListadoComponent } from './administracion/mantenimientos/encuesta/encuesta-listado/encuesta-listado.component';
import { EncuestaEdicionComponent } from './administracion/mantenimientos/encuesta/encuesta-edicion/encuesta-edicion.component';
import { FinanciamientoEncuestaComponent } from './operaciones/financiamientos/financiamiento-encuesta/financiamiento-encuesta.component';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { MotivoListadoComponent } from './administracion/mantenimientos/motivo/motivo-listado/motivo-listado.component';
import { MotivoEdicionComponent } from './administracion/mantenimientos/motivo/motivo-edicion/motivo-edicion.component';
import { FinanciamientoAnulacionComponent } from './operaciones/financiamientos/financiamiento-anulacion/financiamiento-anulacion.component';
import { FinanciamientoArchivoComponent } from './operaciones/financiamientos/financiamiento-archivo/financiamiento-archivo.component';
import { OnlyNumberDirective } from 'src/app/directives/only-number.directive';
import { CodigoEncuestaDirective } from 'src/app/directives/codigo-encuesta.directive';
import { CodigoPreguntaDirective } from 'src/app/directives/codigo-pregunta.directive';
import { CodigoAlternativaDirective } from 'src/app/directives/codigo-alternativa.directive';
import { CodigoMotivoDirective } from 'src/app/directives/codigo-motivo.directive';
import { CodigoMaterialDirective } from 'src/app/directives/codigo-material.directive';
import { OnlyLetterSpaceDirective } from 'src/app/directives/only-letter-space.directive';
import { OnlyLetterSpaceNumberDirective } from 'src/app/directives/only-letter-space-number.directive';
import { NombrePreguntaDirective } from 'src/app/directives/nombre-pregunta.directive';
import { NombreAlternativaDirective } from 'src/app/directives/nombre-alternativa.directive';
import { NombreSedeDirective } from 'src/app/directives/nombre-sede.directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { OnlyAddressStreetDirective } from '../directives/only-address-street.directive';
import { OnlyLetterNumberDirective } from '../directives/only-letter-number.directive';
import { LetterNumberSignDirective } from '../directives/letter-number-sign.directive';
import { ProductListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-listado/product-listado.component';
import { ProductEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-edicion/product-edicion.component';
import { ProductUploadMasiveComponent } from './administracion/mantenimientos/virtual-office/product/product-upload-masive/product-upload-masive.component';
import { ModalMasiveProductsDetailComponent } from './administracion/mantenimientos/virtual-office/product/modal-masive-products-detail/modal-masive-products-detail.component';
import { ProductsModalFichaTecnicaComponent } from './administracion/mantenimientos/virtual-office/product/products-modal-ficha-tecnica/products-modal-ficha-tecnica.component';
import { ProductBrandEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-brand-edicion/product-brand-edicion.component';
import { ProductBrandListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-brand-listado/product-brand-listado.component';
import { ProductSectionListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-section-listado/product-section-listado.component';
import { ProductSectionEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-section-edicion/product-section-edicion.component';
import { ProductSubcategoryEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-subcategory-edicion/product-subcategory-edicion.component';
import { ProductSubcategoryListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-subcategory-listado/product-subcategory-listado.component';
import { StoreAllyIndexComponent } from './administracion/mantenimientos/store-ally/store-ally-index/store-ally-index.component';
import { StoreAllyFormComponent } from './administracion/mantenimientos/store-ally/store-ally-form/store-ally-form.component';
import { BranchAllyFormComponent } from './administracion/mantenimientos/branch-ally/branch-ally-form/branch-ally-form.component';
import { BranchAllyIndexComponent } from './administracion/mantenimientos/branch-ally/branch-ally-index/branch-ally-index.component';
import { BasesCargadaComponent } from './administracion/bases-cargada/bases-cargada.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsuarioEdicionComponent,
    UsuarioListadoComponent,
    CambioClaveComponent,
    ClienteListadoComponent,
    ClienteEdicionComponent,
    AgregarProductoComponent,
    AnularFinanciamientoComponent,
    CargaArchivosComponent,
    PagingGridComponent,
    ListaCargaComponent,
    AliadosDashboardComponent,
    VentasDashboardComponent,
    PromocionesDashboardComponent,
    DateFormatPipe,
    MensajePaginadorPipe,
    ConsultaCreditoComponent,
    FinanciamientosComponent,
    OrdenesDePagoComponent,
    PerfilesComponent,
    CanalesComponent,
    FinanciamientoFormComponent,
    FinanciamientoDatosGeneralesComponent,
    FinanciamientoCreateComponent,
    FinanciamientoEditComponent,
    FinanciamientoCuotasComponent,
    FinanciamientoProductosComponent,
    FinanciamientoDespachoComponent,
    FinanciamientoDespachoEditComponent,
    SimuladorCuotasComponent,
    CorreosMantenimientoComponent,
    EstadisticasComponent,
    DashBoardStatsComponent,
    VerConsumoComponent,
    FinanciamientoCombosComponent,
    CommercialAllyIndexComponent,
    CommercialAllyFormComponent,
    CategoryIndexComponent,
    CategoryFormComponent,
    EmailSenderComponent,
    BranchOfficeIndexComponent,
    BranchOfficeFormComponent,
    EncuestaListadoComponent,
    EncuestaEdicionComponent,
    FinanciamientoEncuestaComponent,
    CarouselComponent,
    MotivoListadoComponent,
    MotivoEdicionComponent,
    FinanciamientoAnulacionComponent,
    FinanciamientoArchivoComponent,
    OnlyNumberDirective,
    CodigoEncuestaDirective,
    CodigoPreguntaDirective,
    CodigoMotivoDirective,
    CodigoMaterialDirective,
    NombrePreguntaDirective,
    CodigoAlternativaDirective,
    NombreAlternativaDirective,
    NombreSedeDirective,
    OnlyLetterSpaceDirective,
    OnlyLetterSpaceNumberDirective,
    OnlyAddressStreetDirective,
    OnlyLetterNumberDirective,
    LetterNumberSignDirective,
    ProductListadoComponent,
    ProductEdicionComponent,
    ProductUploadMasiveComponent,
    ModalMasiveProductsDetailComponent,
    ProductsModalFichaTecnicaComponent,
    ProductBrandEdicionComponent,
    ProductBrandListadoComponent,
    ProductSectionListadoComponent,
    ProductSectionEdicionComponent,
    ProductSubcategoryEdicionComponent,
    ProductSubcategoryListadoComponent,
    StoreAllyIndexComponent,
    StoreAllyFormComponent,
    BranchAllyFormComponent,
    BranchAllyIndexComponent,
    BasesCargadaComponent
  ],
  entryComponents: [
    FinanciamientoDespachoComponent,
    FinanciamientoEncuestaComponent,
    EmailSenderComponent,
    FinanciamientoAnulacionComponent,
    ProductUploadMasiveComponent,
    ModalMasiveProductsDetailComponent,
    FinanciamientoArchivoComponent,
    ProductsModalFichaTecnicaComponent
  ],
  imports: [
    CommonModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    SlickCarouselModule,
    TreeTableModule,
    ComponentsModule,
    ReactiveFormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    CalendarModule,
    RxReactiveFormsModule,
    MaterialFileInputModule,
    TextMaskModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    PagesComponent,
    OnlyNumberDirective,
    CodigoEncuestaDirective,
    CodigoPreguntaDirective,
    NombrePreguntaDirective,
    CodigoAlternativaDirective,
    CodigoMotivoDirective,
    CodigoMaterialDirective,
    NombreAlternativaDirective,
    NombreSedeDirective,
    OnlyLetterSpaceDirective,
    OnlyLetterSpaceNumberDirective,
    LetterNumberSignDirective
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PagesModule {}
