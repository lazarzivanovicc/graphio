import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleVideoPreview } from './single-video-preview';

describe('SingleVideoPreview', () => {
  let component: SingleVideoPreview;
  let fixture: ComponentFixture<SingleVideoPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleVideoPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleVideoPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
