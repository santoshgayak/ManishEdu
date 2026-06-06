import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHero } from './shop-hero';

describe('ShopHero', () => {
  let component: ShopHero;
  let fixture: ComponentFixture<ShopHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopHero],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
