import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsListComponentComponent } from './reviews-list-component.component';

describe('ReviewsListComponentComponent', () => {
  let component: ReviewsListComponentComponent;
  let fixture: ComponentFixture<ReviewsListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewsListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
