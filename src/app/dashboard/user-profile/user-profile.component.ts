import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserInterface } from '../../models/user';
import { User } from 'firebase';
import { map} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  
  bienvenido:boolean;

  userinterface: UserInterface = {
    displayName: '',
    uid:'',
    email: '',
    photoURL: '',
    welcome:undefined,
  
  }
  public providerId:string='null';

  constructor(private authService: AuthService, private auth:AngularFireAuth, 
     private afs: AngularFirestore,) { 
      
}



  
  ngOnInit() {
    this.getCurrentUser();


setTimeout(() => {

   
    let user = {
      displayName:this.userinterface.displayName,
      uid:this.userinterface.uid,
      email: this.userinterface.email,
      photoURL:this.userinterface.photoURL,
      welcome:true,
    }
   
    console.log(this.bienvenido)
      this.upDate(user)
  
}, 500);

setTimeout(() => {
  if(this.userinterface.welcome == false){
    this.bienvenido=true
  }else{
    this.bienvenido=false
  }
}, 400);


 
}




  
async getCurrentUser(){
 await this.authService.isAuth().subscribe(data => {
   
    if (data) {
      this.userinterface.uid = data.uid
      this.userinterface.displayName = data.displayName;
      this.userinterface.email = data.email;
      this.userinterface.photoURL = data.photoURL;
      this.providerId = data.providerData[0].providerId;
       
    }
    
  })
  
}

getUser(id){
 this.authService.getUser(id).get().subscribe(doc =>{
  
 })
}

upDate(user){
this.authService.userUpdate(user).then(res=>{
  
}).catch(err=> console.log(err))
}


}
