import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipListComponent } from './entrepreneurship-list-component.component';

describe('EntrepreneurshipListComponentComponent', () => {
  let component: EntrepreneurshipListComponent;
  let fixture: ComponentFixture<EntrepreneurshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
