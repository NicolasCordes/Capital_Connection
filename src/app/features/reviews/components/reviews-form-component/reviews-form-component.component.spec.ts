import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsFormComponentComponent } from './reviews-form-component.component';

describe('ReviewsFormComponentComponent', () => {
  let component: ReviewsFormComponentComponent;
  let fixture: ComponentFixture<ReviewsFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewsFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
