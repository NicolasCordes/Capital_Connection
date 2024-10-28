import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipDetailComponentComponent } from './entrepreneurship-detail-component.component';

describe('EntrepreneurshipDetailComponentComponent', () => {
  let component: EntrepreneurshipDetailComponentComponent;
  let fixture: ComponentFixture<EntrepreneurshipDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurshipDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
