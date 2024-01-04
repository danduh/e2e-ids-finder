import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAllElemsComponent } from './find-all-elems.component';

describe('FindAllElemsComponent', () => {
  let component: FindAllElemsComponent;
  let fixture: ComponentFixture<FindAllElemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindAllElemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindAllElemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
