import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FacturasService } from '../../services/facturas/facturas.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent implements OnInit {

  nameFactura: string;
 barraCargaEdit:boolean=false;
  myClass="";
  constructor(private toast:ToastrService, public facturasdb:FacturasService, private storage: AngularFireStorage, private auth: AuthService 
 ) { 
  
 }
 @ViewChild('file', {static: false}) file:ElementRef;
 @ViewChild('btnClose', {static: false}) btnClose:ElementRef;

 uploadPercentEdit: Observable<number>;
 urlFactura: Observable<string>;
 urldocEdit:any='';
 user:any;
 date_emit:any;
 codigo_referencia:string;
 actualizarDoc: boolean = false
  ngOnInit() {

    
   this.auth.isAuth().subscribe(auth=>{
this.user= auth
})

  }


  onEditUpload(e) {
    this.barraCargaEdit=true
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `facturas/factura_${id}`;
    const fileName = `${e.target.files[0].name}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentEdit = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(()  => this.urlFactura= ref.getDownloadURL())).subscribe(data=>{
      this.urldocEdit  = data.ref.fullPath;
      this.nameFactura = fileName;
      this.actualizarDoc=true
      });   
  }


  updateFactura(){
    if(this.facturasdb.facturaSelected.facture_name =='' || this.facturasdb.facturaSelected.facture_number =='' || this.facturasdb.facturaSelected.name_business==''|| 
    this.facturasdb.facturaSelected.rut_business=='' || this.facturasdb.facturaSelected.name_client=='' || this.facturasdb.facturaSelected.rut_client=='' 
    || this.facturasdb.facturaSelected.date_emit=='' || this.facturasdb.facturaSelected.address=='' || this.facturasdb.facturaSelected.giro=='' 
    ){
      this.myClass="was-validated"

    }else{
      // actualizacion de fecha
      if(this.date_emit=[]){
        if(this.actualizarDoc == false){
          this.urldocEdit=this.facturasdb.facturaSelected.url
        }
        
        let factura:any={
          id:this.facturasdb.facturaSelected.id,
          uid:this.user.Sb.uid,
          facture_name:this.facturasdb.facturaSelected.facture_name,
          facture_number:this.facturasdb.facturaSelected.facture_number,
          name_business:this.facturasdb.facturaSelected.name_business,
          rut_business:this.facturasdb.facturaSelected.rut_business,
          name_client:this.facturasdb.facturaSelected.name_client,
          rut_client:this.facturasdb.facturaSelected.rut_client,
          address:this.facturasdb.facturaSelected.address,
          giro:this.facturasdb.facturaSelected.giro,
          fileName:this.facturasdb.facturaSelected.fileName,
          url:this.urldocEdit,
          date_create:moment().toISOString(),
         date_emit:this.facturasdb.facturaSelected.date_emit
        }
        console.log('actualizado',factura)
        this.facturasdb.updateFactura(factura)
      this.btnClose.nativeElement.click();
      }else{
     
        let factura:any={
        id:this.facturasdb.facturaSelected.id,
        uid:this.user.Sb.uid,
        facture_number:this.facturasdb.facturaSelected.facture_number,
        name_business:this.facturasdb.facturaSelected.name_business,
        rut_business:this.facturasdb.facturaSelected.rut_business,
        name_client:this.facturasdb.facturaSelected.name_client,
        rut_client:this.facturasdb.facturaSelected.rut_client,
        address:this.facturasdb.facturaSelected.address,
        giro:this.facturasdb.facturaSelected.giro,
        fileName:this.nameFactura,
        url:this.urldocEdit,
        date_create:moment().toISOString(),
       date_emit:this.date_emit.day + '/'+ this.date_emit.month + '/'+ this.date_emit.year
      }
      console.log('actualizado',factura)
      this.facturasdb.updateFactura(factura).then(()=>{
        this.ToastsuccessUpdateFac();
      }).catch(err=>{
        this.ToasterrorUpdateFac();
      })
      this.btnClose.nativeElement.click();
    } 
    }  
  } 

cancelEditUpload(){
  this.actualizarDoc=false
  this.storage.ref(this.urldocEdit).delete();
  this.urlFactura  = null;
  this.nameFactura='';
  this.urldocEdit='';
  this.file.nativeElement.value = '';
  this.barraCargaEdit=false;

}

async ToasterrorUpdateFac(){
  await this.toast.error('Ha sucedido un error vuelva a intentarlo','Error')
 }

 async ToastsuccessUpdateFac(){
   await this.toast.success('Factura actualizada exitosamente','Exito')
  }

}
