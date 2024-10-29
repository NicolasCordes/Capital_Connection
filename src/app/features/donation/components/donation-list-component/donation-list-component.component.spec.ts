import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationListComponentComponent } from './donation-list-component.component';

describe('DonationListComponentComponent', () => {
  let component: DonationListComponentComponent;
  let fixture: ComponentFixture<DonationListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
