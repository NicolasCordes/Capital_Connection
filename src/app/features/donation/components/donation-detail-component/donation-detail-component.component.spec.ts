import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationDetailComponentComponent } from './donation-detail-component.component';

describe('DonationDetailComponentComponent', () => {
  let component: DonationDetailComponentComponent;
  let fixture: ComponentFixture<DonationDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
