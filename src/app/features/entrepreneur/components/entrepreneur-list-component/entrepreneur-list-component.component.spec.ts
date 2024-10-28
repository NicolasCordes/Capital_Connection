import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurListComponentComponent } from './entrepreneur-list-component.component';

describe('EntrepreneurListComponentComponent', () => {
  let component: EntrepreneurListComponentComponent;
  let fixture: ComponentFixture<EntrepreneurListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrepreneurListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
