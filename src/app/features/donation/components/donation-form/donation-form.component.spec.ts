import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationFormComponent } from './donation-form.component';

describe('DonationFormComponent', () => {
  let component: DonationFormComponent;
  let fixture: ComponentFixture<DonationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
