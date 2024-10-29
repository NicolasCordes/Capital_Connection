import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipDetailComponent } from './entrepreneurship-detail-component.component';

describe('EntrepreneurshipDetailComponentComponent', () => {
  let component: EntrepreneurshipDetailComponent;
  let fixture: ComponentFixture<EntrepreneurshipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
