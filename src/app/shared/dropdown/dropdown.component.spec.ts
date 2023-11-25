import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent],
      imports: [CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty options array by default', () => {
    expect(component.options).toEqual([]);
  });

  it('should have empty selected option by default', () => {
    expect(component.selectedOption).toEqual('');
  });

  it('should not show dropdown by default', () => {
    const dropdownElement = fixture.nativeElement.querySelector('.dropdown');
    expect(dropdownElement).toBeFalsy();
  });

  it('should toggle dropdown visibility', () => {
    component.toggleDropdown();
    fixture.detectChanges();
    const dropdownElement = fixture.nativeElement.querySelector('.dropdown');
    expect(dropdownElement).toBeTruthy();
  });

  it('should emit optionSelected event on option selection', () => {
    const testOption = 'Option 1';
    const optionSelectedSpy = jest.spyOn(component.optionSelected, 'emit');
    component.selectOption(testOption);
    expect(optionSelectedSpy).toHaveBeenCalledWith(testOption);
  });

  it('should close dropdown on option selection', () => {
    component.isDropdownOpen = true;
    component.selectOption('Option 1');
    fixture.detectChanges();
    const dropdownElement = fixture.nativeElement.querySelector('.dropdown');
    expect(dropdownElement).toBeFalsy();
  });

  it('should display options in the template', () => {
    const testOptions = ['Option 1', 'Option 2', 'Option 3'];
    component.options = testOptions;
    fixture.detectChanges();
    const optionElements = fixture.nativeElement.querySelectorAll('.dropdown-option');
    expect(optionElements.length).toEqual(testOptions.length);
  });

  it('should emit optionSelected event on option click', () => {
    const testOptions = ['Option 1', 'Option 2', 'Option 3'];
    component.options = testOptions;
    const optionSelectedSpy = jest.spyOn(component.optionSelected, 'emit');
    fixture.detectChanges();
    const optionElement = fixture.nativeElement.querySelector('.dropdown-option');
    optionElement.click();
    expect(optionSelectedSpy).toHaveBeenCalledWith(testOptions[0]);
  });
});

