import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Qualities } from './qualities';

describe('Qualities', () => {
  let component: Qualities;
  let fixture: ComponentFixture<Qualities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Qualities],
    }).compileComponents();

    fixture = TestBed.createComponent(Qualities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
