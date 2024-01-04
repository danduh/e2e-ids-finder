import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeHolderComponent } from './code-holder.component';

describe('CodeHolderComponent', () => {
  let component: CodeHolderComponent;
  let fixture: ComponentFixture<CodeHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
