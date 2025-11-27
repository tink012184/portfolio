import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpgDemoComponent } from './rpg-demo.component';

describe('RpgDemoComponent', () => {
  let component: RpgDemoComponent;
  let fixture: ComponentFixture<RpgDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpgDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpgDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
