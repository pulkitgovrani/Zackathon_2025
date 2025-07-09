import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinderDetailComponent } from './binder-detail.component';

describe('BinderDetailComponent', () => {
  let component: BinderDetailComponent;
  let fixture: ComponentFixture<BinderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinderDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BinderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
