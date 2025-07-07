import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BindersListComponent } from './binders-list.component';

describe('BindersListComponent', () => {
  let component: BindersListComponent;
  let fixture: ComponentFixture<BindersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BindersListComponent]
    });
    fixture = TestBed.createComponent(BindersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
