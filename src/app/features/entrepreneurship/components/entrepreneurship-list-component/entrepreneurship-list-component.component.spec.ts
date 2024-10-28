import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipListComponentComponent } from './entrepreneurship-list-component.component';

describe('EntrepreneurshipListComponentComponent', () => {
  let component: EntrepreneurshipListComponentComponent;
  let fixture: ComponentFixture<EntrepreneurshipListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurshipListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
