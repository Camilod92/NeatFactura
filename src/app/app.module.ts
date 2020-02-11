import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore} from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './dashboard/user-profile/user-profile.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FacturasComponent } from './dashboard/facturas/facturas.component';

import { FacturaAdminComponent } from './dashboard/facturas/factura-admin/factura-admin.component';
import { ModalComponent } from './dashboard/modal/modal.component';
import { ModalEditComponent } from './dashboard/modal-edit/modal-edit.component';
import { PrincipalComponent } from './landing/principal/principal.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LandingComponent,
    DashboardComponent,
    UserProfileComponent,
    FacturasComponent,
  
    FacturaAdminComponent,
    ModalComponent,
    ModalEditComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:2000
    }),
    FormsModule,
    NgbModule,
   ReactiveFormsModule,
    AppRoutingModule,
    NgxPageScrollModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  
  ],
  providers: [AngularFirestore, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
