import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurshipsUpdatesComponent } from './entrepreneurships-updates.component';

describe('EntrepreneurshipsUpdatesComponent', () => {
  let component: EntrepreneurshipsUpdatesComponent;
  let fixture: ComponentFixture<EntrepreneurshipsUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepreneurshipsUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepreneurshipsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
