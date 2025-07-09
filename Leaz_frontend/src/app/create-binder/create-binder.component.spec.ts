import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBinderComponent } from './create-binder.component';

describe('CreateBinderComponent', () => {
  let component: CreateBinderComponent;
  let fixture: ComponentFixture<CreateBinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBinderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
