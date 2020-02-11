import { Component, OnInit,  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  user:any;
  constructor(
    private auth: AuthService, private router: Router,
    private toast:ToastrService
  ) { }
  public isLogged: boolean = false;
  ngOnInit() {
    this.getCurrentUser();
  }
  getCurrentUser() {
    this.auth.isAuth().subscribe(auth => {
      if (auth) {
        this.user=auth
        console.log('user logged', this.user);
        this.isLogged = true;
        this.Toastsuccesslogin();
        this.router.navigate(['dashboard/home'])
      } else {
        console.log('NOT user logged');
        this.isLogged = false;
      }
    });
}


async Toastsuccesslogin(){
  await this.toast.success('Redirigiendo al Tablero de Mando','Estas logeado')
 }
}