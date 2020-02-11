import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Factura } from '../../models/factura';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


export interface FacturaID extends Factura {id: string}
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private facturasCollection: AngularFirestoreCollection<Factura>;
 
  private facturas:Observable<Factura[]>;
  private facturaDoc: AngularFirestoreDocument<Factura>;
  private factura: Observable<Factura>;

  
  private facturaSubject = new BehaviorSubject<any>([]);
  public  $facturas=  this.facturaSubject.asObservable();
  
  public facturaSelected = {
    id:null,
    uid:'',
    facture_name:'',
    facture_number: '',
    name_business: '',
    rut_business:'',
    name_client:'',
    date_emit:'',
    rut_client:'',
    address: '',
    giro:'',
    fileName:'',
    url:'',
    date_create:''
  }


  constructor(private afs:AngularFirestore, ) { 
    this.facturasCollection = afs.collection<Factura>('facturas');
    this.facturas = this.facturasCollection.snapshotChanges().pipe(
      map(actions=> actions.map(a=>{
        const data = a.payload.doc.data() as Factura;
        const id = a.payload.doc.id;
        return {id, ...data}
      }))
    );


  }
  


  getAllFacturas(){
    return this.facturas
  }

sendFacture(facturas){
  this.facturaSubject.next(facturas)
}

   addFactura(factura: Factura) {
   return this.facturasCollection.add(factura);
  }


  updateFactura(factura: FacturaID){
    let idFactura = factura.id;
  return  this.facturasCollection.doc(idFactura).update(factura);
   
  }

  deleteFactura(id: string){
    this.facturaDoc = this.afs.doc<Factura>(`facturas/${id}`);
   return this.facturaDoc.delete();
  }
}
