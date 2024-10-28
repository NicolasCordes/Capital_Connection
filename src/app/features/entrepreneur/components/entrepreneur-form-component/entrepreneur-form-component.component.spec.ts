import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurFormComponentComponent } from './entrepreneur-form-component.component';

describe('EntrepreneurFormComponentComponent', () => {
  let component: EntrepreneurFormComponentComponent;
  let fixture: ComponentFixture<EntrepreneurFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
