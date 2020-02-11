import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

import { UserInterface } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user:any;
 loading:boolean=true;
  userUpdate:any;
  constructor(private auth: AuthService, private router: Router) {
    
   }
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
        this.loading=false;
      } else {
        console.log('NOT user logged');
        this.isLogged = false;
      }
 
    });
   
   

  }


  onLogout() {
   
    this.auth.logoutUser();
  }



    
}
