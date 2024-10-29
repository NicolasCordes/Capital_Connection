import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationFormComponentComponent } from './donation-form-component.component';

describe('DonationFormComponentComponent', () => {
  let component: DonationFormComponentComponent;
  let fixture: ComponentFixture<DonationFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
