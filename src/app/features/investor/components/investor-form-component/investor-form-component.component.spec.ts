import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorFormComponentComponent } from './investor-form-component.component';

describe('InvestorFormComponentComponent', () => {
  let component: InvestorFormComponentComponent;
  let fixture: ComponentFixture<InvestorFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestorFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
