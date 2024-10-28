import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorDetailComponentComponent } from './investor-detail-component.component';

describe('InvestorDetailComponentComponent', () => {
  let component: InvestorDetailComponentComponent;
  let fixture: ComponentFixture<InvestorDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestorDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
