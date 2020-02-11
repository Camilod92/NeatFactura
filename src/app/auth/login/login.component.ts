import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toast:ToastrService,public afAuth: AngularFireAuth, private router: Router, private authService: AuthService , ) { }
  public email: string = '';
  public password: string = '';
  ngOnInit() {
  }

  onLogin(): void {
    this.authService.loginEmailUser(this.email, this.password)
      .then((res) => {
        this.Toastsuccesslogin()
        this.onLoginRedirect();
      }).catch(err => this.Toasterrorlogin());
  }

 async onLoginGoogle() {
  await  this.authService.loginGoogleUser()
      .then((res) => {
    this.Toastsuccesslogin();
        this.onLoginRedirect();
      }).catch(err => this.Toasterrorlogin());
  }
 

  onLogout() {
    this.authService.logoutUser();
  }
  onLoginRedirect(): void {
    this.router.navigate(['/dashboard/home']);
  }

  async Toasterrorlogin(){
   await this.toast.error('error al intentar iniciar sesión','Error')
  }

  async Toastsuccesslogin(){
    await this.toast.success('Has iniciado con exito','Exito')
   }
 

}

