import { Component, OnInit, ElementRef, ViewChild,  } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../services/auth/auth.service';
import { UserInterface } from '../../models/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  barraCarga=false;
  urldoc: string;
  nameImagen:string='';
  constructor(private toast:ToastrService, private formBuilder:FormBuilder, private router: Router, private authService: AuthService, private storage: AngularFireStorage) { 
   
  }
  @ViewChild('file', {static: false}) file:ElementRef;
  @ViewChild('imageUser', {static: false}) inputImageUser: ElementRef;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  registerForm: FormGroup;
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name:['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      lastname: ['', Validators.required],
      photoURL:['', Validators.required]
    });

  }

  onUpload(e) {
    this.barraCarga=true;
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const fileName = `${e.target.files[0].name}`;
    const filePath = `uploads/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe(data=>{
      this.urldoc  = data.ref.fullPath;
      this.nameImagen = fileName;
     
      });;
  }
  onAddUser() {
    this.authService.registerUser(this.registerForm.value)
      .then((res) => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
            
            user.updateProfile({
              displayName: this.registerForm.value.name + ' ' + this.registerForm.value.lastname,
              photoURL: this.inputImageUser.nativeElement.value
            }).then(() => {

              let userdb ={
                uid: user.uid,
                displayName:this.registerForm.value.name + ' ' + this.registerForm.value.lastname,
                email:this.registerForm.value.email,
                password: this.registerForm.value.password,
                photoURL: this.inputImageUser.nativeElement.value,
                welcome: false
              }
              this.authService.addUser(userdb);
              this.ToastsuccessR();
              this.router.navigate(['dashboard/home']);
            
          }
        )}});
      }).catch(err => this.ToasterrorR());
      
  }

 

  onLoginRedirect(): void {
    this.router.navigate(['dashboard/home']);
  }

  cancelUpload(e){
    
    this.storage.ref(this.urldoc).delete();
    this.urlImage  = null;
    this.urldoc='';
    this.nameImagen='';
    this.file.nativeElement.value = ''
    this.barraCarga=false;
  
  }
  async ToasterrorR(){
    await this.toast.error('Error al intentar registrar','Error')
   }
 
   async ToastsuccessR(){
     await this.toast.success('Has sido registrado con exito','Exito')
    }

}
