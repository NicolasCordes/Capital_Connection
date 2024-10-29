import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDetailComponentComponent } from './reviews-detail-component.component';

describe('ReviewsDetailComponentComponent', () => {
  let component: ReviewsDetailComponentComponent;
  let fixture: ComponentFixture<ReviewsDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewsDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
