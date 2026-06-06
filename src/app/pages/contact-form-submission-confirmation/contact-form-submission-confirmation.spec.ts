import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormSubmissionConfirmation } from './contact-form-submission-confirmation';

describe('ContactFormSubmissionConfirmation', () => {
  let component: ContactFormSubmissionConfirmation;
  let fixture: ComponentFixture<ContactFormSubmissionConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormSubmissionConfirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormSubmissionConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
