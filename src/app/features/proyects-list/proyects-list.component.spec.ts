import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectsListComponent } from './proyects-list.component';

describe('ProyectsListComponent', () => {
  let component: ProyectsListComponent;
  let fixture: ComponentFixture<ProyectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
