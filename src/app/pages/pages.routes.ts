import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioEdicionComponent } from './administracion/mantenimientos/usuario/usuario-edicion/usuario-edicion.component';
import { UsuarioListadoComponent } from './administracion/mantenimientos/usuario/usuario-listado/usuario-listado.component';
import { ClienteEdicionComponent } from './administracion/mantenimientos/cliente/cliente-edicion/cliente-edicion.component';
import { ClienteListadoComponent } from './administracion/mantenimientos/cliente/cliente-listado/cliente-listado.component';
import { CargaArchivosComponent } from './administracion/carga-archivos/carga-archivos.component';
import { ConsultaCreditoComponent } from './operaciones/consulta-credito/consulta-credito.component';
import { FinanciamientosComponent } from './operaciones/financiamientos/financiamientos.component';
import { OrdenesDePagoComponent } from './reportes/ordenes-de-pago/ordenes-de-pago.component';
import { ListaCargaComponent } from './administracion/mantenimientos/lista-carga/lista-carga.component';
import { FinanciamientoFormComponent } from './operaciones/financiamientos/financiamiento-form/financiamiento-form.component';
import { CorreosMantenimientoComponent } from './administracion/mantenimientos/correos/correos-mantenimiento.component';
import { EstadisticasComponent } from './reportes/estadisticas/estadisticas.component';
import { CommercialAllyIndexComponent } from './administracion/mantenimientos/commercial-ally/commercial-ally-index/commercial-ally-index.component';
import { CommercialAllyFormComponent } from './administracion/mantenimientos/commercial-ally/commercial-ally-form/commercial-ally-form.component';
import { AuthGuard } from '../guards/auth.guard';
import { CategoryFormComponent } from './administracion/mantenimientos/category/category-form/category-form.component';
import { CategoryIndexComponent } from './administracion/mantenimientos/category/category-index/category-index.component';
import { EncuestaListadoComponent } from './administracion/mantenimientos/encuesta/encuesta-listado/encuesta-listado.component';
import { EncuestaEdicionComponent } from './administracion/mantenimientos/encuesta/encuesta-edicion/encuesta-edicion.component';
import { BranchOfficeIndexComponent } from './administracion/mantenimientos/branch-office/branch-office-index/branch-office-index.component';
import { BranchOfficeFormComponent } from './administracion/mantenimientos/branch-office/branch-office-form/branch-office-form.component';
import { CanalesComponent } from './administracion/permisos/canales/canales.component';
import { PerfilesComponent } from './administracion/permisos/perfiles/perfiles.component';
import { MotivoListadoComponent } from './administracion/mantenimientos/motivo/motivo-listado/motivo-listado.component';
import { MotivoEdicionComponent } from './administracion/mantenimientos/motivo/motivo-edicion/motivo-edicion.component';
import { ProductListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-listado/product-listado.component';
import { ProductEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-edicion/product-edicion.component';
import { ProductBrandListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-brand-listado/product-brand-listado.component';
import { ProductBrandEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-brand-edicion/product-brand-edicion.component';
import { ProductSectionListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-section-listado/product-section-listado.component';
import { ProductSectionEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-section-edicion/product-section-edicion.component';
import { ProductSubcategoryListadoComponent } from './administracion/mantenimientos/virtual-office/product/product-subcategory-listado/product-subcategory-listado.component';
import { ProductSubcategoryEdicionComponent } from './administracion/mantenimientos/virtual-office/product/product-subcategory-edicion/product-subcategory-edicion.component';
import { StoreAllyIndexComponent } from './administracion/mantenimientos/store-ally/store-ally-index/store-ally-index.component';
import { StoreAllyFormComponent } from './administracion/mantenimientos/store-ally/store-ally-form/store-ally-form.component';
import { BranchAllyIndexComponent } from './administracion/mantenimientos/branch-ally/branch-ally-index/branch-ally-index.component';
import { BranchAllyFormComponent } from './administracion/mantenimientos/branch-ally/branch-ally-form/branch-ally-form.component';
import { BasesCargadaComponent } from './administracion/bases-cargada/bases-cargada.component';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [VerificaTokenGuard],
    data: { titulo: 'Dashboard' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
      },
      {
        path: 'canales',
        component: CanalesComponent,
        data: { titulo: 'Canales' }
      },
      {
        path: 'perfiles',
        component: PerfilesComponent,
        data: { titulo: 'Perfiles' }
      },
      {
        path: 'listado-usuario',
        component: UsuarioListadoComponent,
        data: { titulo: 'Listado de Usuario' }
      },
      {
        path: 'usuario',
        component: UsuarioEdicionComponent,
        data: { titulo: 'Usuario' }
      },
      {
        path: 'usuario/:id',
        component: UsuarioEdicionComponent,
        data: { titulo: 'Editar Usuario' }
      },
      {
        path: 'listado-cliente',
        component: ClienteListadoComponent,
        data: { titulo: 'Listado de Cliente' }
      },
      {
        path: 'cliente',
        component: ClienteEdicionComponent,
        data: { titulo: 'Cliente' }
      },
      {
        path: 'cliente/:id',
        component: ClienteEdicionComponent,
        data: { titulo: 'Editar Cliente' }
      },
      {
        path: 'carga-archivos',
        component: CargaArchivosComponent,
        data: { titulo: 'Carga de Archivos' }
      },
      {
        path: 'lista-carga',
        component: ListaCargaComponent,
        data: { titulo: 'Carga de Archivos' }
      },
      {
        path: 'bases-cargadas',
        component: BasesCargadaComponent,
        data: { titulo: 'Bases Cargadas' }
      },
      {
        path: 'consulta-credito',
        component: ConsultaCreditoComponent,
        data: { titulo: 'Créditos' }
      },
      {
        path: 'financiamientos',
        component: FinanciamientosComponent,
        data: { titulo: 'Financiamientos' }
      },
      {
        path: 'financiamientosfilter/:id',
        component: FinanciamientosComponent,
        data: { titulo: 'Financiamientos' }
      },
      {
        path: 'financiamientos/:id',
        component: FinanciamientoFormComponent,
        data: { titulo: 'Editar Financiamientos' }
      },
      {
        path: 'ordenpago',
        component: OrdenesDePagoComponent,
        data: { titulo: 'Ordenes de pago' }
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'correos-mantenimiento',
        component: CorreosMantenimientoComponent,
        data: { titulo: 'Mantenimiento de correos' }
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
        data: { titulo: 'Estadísticas' }
      },
      {
        path: 'commercial-ally-index',
        component: CommercialAllyIndexComponent,
        data: { titulo: 'Aliado comercial' },
        canActivate: [AuthGuard]
      },
      {
        path: 'commercial-ally-form',
        component: CommercialAllyFormComponent,
        data: { titulo: 'Aliado comercial' },
        canActivate: [AuthGuard]
      },
      {
        path: 'commercial-ally-form/:id',
        component: CommercialAllyFormComponent,
        data: { titulo: 'Editar Aliado Comercial' },
        canActivate: [AuthGuard]
      },
      {
        path: 'category-index',
        component: CategoryIndexComponent,
        data: { titulo: 'Categoría' }
      },
      {
        path: 'category-form',
        component: CategoryFormComponent,
        data: { titulo: 'Categoría' }
      },
      {
        path: 'category-form/:id',
        component: CategoryFormComponent,
        data: { titulo: 'Editar Categoría' }
      },
      {
        path: 'listado-encuesta',
        component: EncuestaListadoComponent,
        data: { titulo: 'Listado de Encuesta' }
      },
      {
        path: 'encuesta',
        component: EncuestaEdicionComponent,
        data: { titulo: 'Encuesta' }
      },
      {
        path: 'encuesta/:id',
        component: EncuestaEdicionComponent,
        data: { titulo: 'Editar Encuesta' }
      },
      {
        path: 'branch-office-index',
        component: BranchOfficeIndexComponent,
        data: { titulo: 'Sede' }
      },
      {
        path: 'branch-office-form',
        component: BranchOfficeFormComponent,
        data: { titulo: 'Sede' }
      },
      {
        path: 'branch-office-form/:id',
        component: BranchOfficeFormComponent,
        data: { titulo: 'Editar Sede' }
      },
      {
        path: 'listado-motivo',
        component: MotivoListadoComponent,
        data: { titulo: 'Listado de Motivo' }
      },
      {
        path: 'motivo',
        component: MotivoEdicionComponent,
        data: { titulo: 'Motivo' }
      },
      {
        path: 'motivo/:id',
        component: MotivoEdicionComponent,
        data: { titulo: 'Editar Motivo' }
      },
      {
        path: 'product-listado',
        component: ProductListadoComponent,
        data: { titulo: 'ProductOv' }
      },
      {
        path: 'product-edicion',
        component: ProductEdicionComponent,
        data: { titulo: 'ProductoOV' }
      },
      {
        path: 'product-edicion/:id',
        component: ProductEdicionComponent,
        data: { titulo: 'Editar Producto' }
      },
      {
        path: 'brand-listado',
        component: ProductBrandListadoComponent,
        data: { titulo: 'Marca' }
      },
      {
        path: 'brand-edicion',
        component: ProductBrandEdicionComponent,
        data: { titulo: 'Marca' }
      },
      {
        path: 'brand-edicion/:id',
        component: ProductBrandEdicionComponent,
        data: { titulo: 'Editar Marca' }
      },
      {
        path: 'section-listado',
        component: ProductSectionListadoComponent,
        data: { titulo: 'Sección' }
      },
      {
        path: 'section-edicion',
        component: ProductSectionEdicionComponent,
        data: { titulo: 'Sección' }
      },
      {
        path: 'section-edicion/:id',
        component: ProductSectionEdicionComponent,
        data: { titulo: 'Editar Sección' }
      },
      {
        path: 'subCategory-listado',
        component: ProductSubcategoryListadoComponent,
        data: { titulo: 'Sección' }
      },
      {
        path: 'subCategory-edicion',
        component: ProductSubcategoryEdicionComponent,
        data: { titulo: 'Sección' }
      },
      {
        path: 'subCategory-edicion/:id',
        component: ProductSubcategoryEdicionComponent,
        data: { titulo: 'Editar Sección' }
      },
      {
        path: 'tienda-aliada',
        component: StoreAllyIndexComponent,
        data: { titulo: 'Tienda Aliada' },
        canActivate: [AuthGuard]
      },
      {
        path: 'tienda-aliada-form',
        component: StoreAllyFormComponent,
        data: { titulo: 'Tienda Aliada' },
        canActivate: [AuthGuard]
      },
      {
        path: 'tienda-aliada-form/:id',
        component: StoreAllyFormComponent,
        data: { titulo: 'Editar Tienda Aliada' },
        canActivate: [AuthGuard]
      },
      {
        path: 'sede-aliada',
        component: BranchAllyIndexComponent,
        data: { titulo: 'Sede Aliada' },
        canActivate: [AuthGuard]
      },
      {
        path: 'sede-aliada-form',
        component: BranchAllyFormComponent,
        data: { titulo: 'Sede Aliada' },
        canActivate: [AuthGuard]
      },
      {
        path: 'sede-aliada-form/:id',
        component: BranchAllyFormComponent,
        data: { titulo: 'Editar Sede Aliada' },
        canActivate: [AuthGuard]
      },
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
