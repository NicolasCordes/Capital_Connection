import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipFormComponentComponent } from './entrepreneurship-form-component.component';

describe('EntrepreneurshipFormComponentComponent', () => {
  let component: EntrepreneurshipFormComponentComponent;
  let fixture: ComponentFixture<EntrepreneurshipFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurshipFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
