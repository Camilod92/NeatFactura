import { FacturasService, FacturaID } from './../../../services/facturas/facturas.service';
import { Component, OnInit } from '@angular/core';
import { Factura } from '../../../models/factura';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-factura-admin',
  templateUrl: './factura-admin.component.html',
  styleUrls: ['./factura-admin.component.css']
})
export class FacturaAdminComponent implements OnInit {

  constructor(private facturasdb:FacturasService, private auth:AuthService) { 
    this.auth.isAuth().subscribe(user =>{
      this.admin= user
    })
  }
  public facturas:Factura[];
  private admin: any;

  ngOnInit() {
    this.getListFacturas();
    
  }

 getListFacturas(){
   this.facturasdb.getAllFacturas().subscribe(facturas =>{
     this.facturas = facturas.filter(facturas => facturas.uid == this.admin.uid)
    
    })
  }
preUpdateFactura(factura:any){
this.facturasdb.facturaSelected= factura
}

  deleteFactura(item){
    
     this.facturasdb.deleteFactura(item);
  }
}
