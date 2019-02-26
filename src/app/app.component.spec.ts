import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {
  let fixture;
  let component;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'boggle'`, () => {
    expect(component.title).toEqual('Boggle');
  });

  it('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Boggle');
  });
  it('should render game board', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#board')).toBeTruthy();
  });
  it('should disable submit button on load', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.attributes[0].nodeName).toContain('disabled');
  });
  it('should enable submit button after one tile selected', () => {
    spyOn(component, 'handleLetterClick');
    const randomTile = Math.floor(Math.random() * 16);
    const lis = fixture.debugElement.nativeElement.querySelectorAll('ul li');
    let tile = lis[randomTile];
    tile.click();
    fixture.detectChanges();
    expect(component.handleLetterClick).toHaveBeenCalled();
  });
  it('should select tile clicked', () => {
    const li = fixture.debugElement.nativeElement.querySelector('#board li');
    console.log(li.getAttribute('class'));
    expect(li.getAttribute('class')).not.toContain('selected');
    component.handleLetterClick(li);
    expect(li.getAttribute('class')).toContain('selected');
  })

});
