import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsFormComponent } from './reviews-form.component';


describe('ReviewsFormComponent', () => {
  let component: ReviewsFormComponent;
  let fixture: ComponentFixture<ReviewsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
