/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextLineComponent } from './text-line.component';

describe('TextLineComponent', () => {
  let component: TextLineComponent;
  let fixture: ComponentFixture<TextLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
