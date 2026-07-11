import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpadateSuccess } from './upadate-success';

describe('UpadateSuccess', () => {
  let component: UpadateSuccess;
  let fixture: ComponentFixture<UpadateSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpadateSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(UpadateSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
