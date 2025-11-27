import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrisDocumenterComponent } from './iris-documenter.component';

describe('IrisDocumenterComponent', () => {
  let component: IrisDocumenterComponent;
  let fixture: ComponentFixture<IrisDocumenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrisDocumenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrisDocumenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
