import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorListComponentComponent } from './investor-list-component.component';

describe('InvestorListComponentComponent', () => {
  let component: InvestorListComponentComponent;
  let fixture: ComponentFixture<InvestorListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestorListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
