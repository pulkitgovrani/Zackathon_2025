import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveItemModalComponent } from './move-item-modal.component';

describe('MoveItemModalComponent', () => {
  let component: MoveItemModalComponent;
  let fixture: ComponentFixture<MoveItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveItemModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
