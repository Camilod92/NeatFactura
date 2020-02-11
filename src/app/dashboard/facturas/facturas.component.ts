import { Component, OnInit } from '@angular/core';
import { FacturasService } from '../../services/facturas/facturas.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  constructor(private facturasdb:FacturasService,    private storage: AngularFireStorage,private auth:AuthService) {
    this.auth.isAuth().subscribe(user =>{
      this.admin= user
   })
  }
  public facturas=[];
  public factura='';
  link_prev:any;
  private admin: any;
  ngOnInit() {
    this.facturasdb.getAllFacturas().subscribe(facturas=>{
        this.facturas = facturas.filter(facturas => facturas.uid == this.admin.uid)
    })
  }

  previsualizarDocumento(url_prev) {
    console.log(url_prev);
  this.link_prev =  this.storage.ref(url_prev).getDownloadURL()
  .subscribe( data => {
    this.link_prev = data;
    window.open(this.link_prev, "_blank");
  })
  // window.open(this.link_prev, "_blank");
  }

}
