import { FacturaAdminComponent } from './dashboard/facturas/factura-admin/factura-admin.component';

import { FacturasComponent } from './dashboard/facturas/facturas.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './dashboard/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [


{path:'landing', component:LandingComponent},
{path:'dashboard', component:DashboardComponent, canActivate : [AuthGuard],children: [

  {
    path: 'home', component: UserProfileComponent, canActivate : [AuthGuard]
  },
  {
    path:'facturas', component:FacturasComponent, canActivate : [AuthGuard]
  },
  
    {path:'factura-admin', component:FacturaAdminComponent, canActivate : [AuthGuard]}
]
},


{path:'', redirectTo:'landing', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
