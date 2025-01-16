import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipFormComponent } from './entrepreneurship-form.component';

describe('EntrepreneurshipFormComponentComponent', () => {
  let component: EntrepreneurshipFormComponent;
  let fixture: ComponentFixture<EntrepreneurshipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepreneurshipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
