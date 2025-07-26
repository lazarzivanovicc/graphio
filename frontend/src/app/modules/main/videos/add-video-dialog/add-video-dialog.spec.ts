import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoDialog } from './add-video-dialog';

describe('AddVideoDialog', () => {
  let component: AddVideoDialog;
  let fixture: ComponentFixture<AddVideoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVideoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
