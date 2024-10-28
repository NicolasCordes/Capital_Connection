import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurDetailComponentComponent } from './entrepreneur-detail-component.component';

describe('EntrepreneurDetailComponentComponent', () => {
  let component: EntrepreneurDetailComponentComponent;
  let fixture: ComponentFixture<EntrepreneurDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
