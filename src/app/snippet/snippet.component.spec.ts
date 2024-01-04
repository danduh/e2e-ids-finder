import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetComponent } from './snippet.component';

describe('SnippetComponent', () => {
  let component: SnippetComponent;
  let fixture: ComponentFixture<SnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
