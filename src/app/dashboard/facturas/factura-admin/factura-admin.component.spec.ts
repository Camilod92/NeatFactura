import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaAdminComponent } from './factura-admin.component';

describe('FacturaAdminComponent', () => {
  let component: FacturaAdminComponent;
  let fixture: ComponentFixture<FacturaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
