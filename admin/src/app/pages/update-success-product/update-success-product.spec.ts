import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSuccessProduct } from './update-success-product';

describe('UpdateSuccessProduct', () => {
  let component: UpdateSuccessProduct;
  let fixture: ComponentFixture<UpdateSuccessProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSuccessProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSuccessProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
