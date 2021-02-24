import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { NgReactModuleWrapperComponent } from './ng-react-module-wrapper.component';

describe('NgReactModuleWrapperComponent', () => {
  let component: NgReactModuleWrapperComponent;
  let fixture: ComponentFixture<NgReactModuleWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ NgReactModuleWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgReactModuleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
