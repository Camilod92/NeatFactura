import { element } from 'protractor';
import { AuthService } from './../../services/auth/auth.service';
import { Factura } from './../../models/factura';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FacturasService,  } from '../../services/facturas/facturas.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  subirRegistro=false;
  nameFactura: string;
  barraCarga=false;
  myClass="";
  constructor(private toast:ToastrService,private facturasdb:FacturasService, private storage: AngularFireStorage
    , private formBuilder:FormBuilder, private auth : AuthService) { 
      
    }
    @ViewChild('file', {static: false}) file:ElementRef;
    @ViewChild('facturaDoc', {static: false}) inputFacturaDoc: ElementRef;
    @ViewChild('btnClose', {static: false}) btnClose:ElementRef;
  uploadPercent: Observable<number>;
  urlFactura: Observable<string>;
  facturaForm:FormGroup;
  user:any;
  urldoc:any;
  actualizarDoc: boolean = false
  ngOnInit() {

     
this.auth.isAuth().subscribe(auth=>{
this.user= auth
})


    this.facturaForm = this.formBuilder.group({
      facture_name:['', Validators.required],
      facture_number:['', Validators.required],
      name_business: ['', Validators.required],
      rut_business: ['', Validators.required],
      name_client: ['', Validators.required],
      rut_client:['', Validators.required],
      date_emit: 
      [{year:'',
      month:'',
      day:''}, Validators.required],
      address: ['', Validators.required],
      giro: ['', Validators.required],
      url:['', Validators.required]
    });
  }

  onUpload(e) {
    this.barraCarga=true
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `facturas/factura_${id}`;
    const fileName = `${e.target.files[0].name}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(()  =>  ref.getDownloadURL())).subscribe(data=>{
    this.urldoc  = data.ref.fullPath;
    this.actualizarDoc=true
    this.nameFactura = fileName;
    if(data.bytesTransferred===data.totalBytes){
     
      this.subirRegistro=true;
    }
    });
  }

  saveFactura(facturaForm){
    if(facturaForm.factura_name =='' || facturaForm.factura_number =='' || facturaForm.name_business==''|| 
    facturaForm.rut_business=='' || facturaForm.name_client=='' || facturaForm.rut_client=='' 
    ||  facturaForm.address=='' || facturaForm.giro=='' || this.subirRegistro == false 
    ){
      this.myClass="was-validated"
     
      
    }else{
      let factura:Factura={
        uid:this.user.Sb.uid,
        facture_name:facturaForm.facture_name,
        facture_number:facturaForm.facture_number,
        name_business:facturaForm.name_business,
        rut_business:facturaForm.rut_business,
        name_client:facturaForm.name_client,
        rut_client:facturaForm.rut_client,
        address:facturaForm.address,
        giro:facturaForm.giro,
        fileName:this.nameFactura,
        url:this.urldoc,
        date_create:moment().toISOString(),
       date_emit:facturaForm.date_emit.day + '/'+ facturaForm.date_emit.month + '/'+ facturaForm.date_emit.year
      }
   
        this.facturasdb.addFactura(factura).then((res) => {
          this.ToastsuccessUpFac();
        }).catch(err=>{
          this.ToasterrorUpFac();
        })
      
     

    
      this.urlFactura  = null;
      this.urldoc='';
      this.nameFactura='';
      this.file.nativeElement.value = ''
      this.barraCarga=false;
      this.subirRegistro=false;
      this.facturaForm.reset();
      this.myClass=null;
      this.btnClose.nativeElement.click();
    }
      
      
    
    
  } 
  cancelUpload(){
    this.actualizarDoc=false
    this.storage.ref(this.urldoc).delete();
    this.urlFactura  = null;
    this.urldoc='';
    this.nameFactura='';
    this.file.nativeElement.value = '';
    this.subirRegistro=false;
    this.barraCarga=false;
  
  }

  async ToasterrorUpFac(){
    await this.toast.error('Ha sucedido un error vuelva a intentarlo','Error')
   }
 
   async ToastsuccessUpFac(){
     await this.toast.success('Factura subida exitosamente','Exito')
    }

}
