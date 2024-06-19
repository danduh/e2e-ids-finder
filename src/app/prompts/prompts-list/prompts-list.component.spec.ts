import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsListComponent } from './prompts-list.component';

describe('PromptsListComponent', () => {
  let component: PromptsListComponent;
  let fixture: ComponentFixture<PromptsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
