import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent],
      imports: [CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    expect(component.title).toEqual('');
  });

  it('should emit confirm event', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    component.confirmAction();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.cancelAction();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should display the title', () => {
    const testTitle = 'Confirmation Title';
    component.title = testTitle;
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.modal-title');
    expect(titleElement.textContent).toContain(testTitle);
  });

  it('should emit confirm event on button click', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event on button click', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    const cancelButton = fixture.nativeElement.querySelector('.cancel-button');
    cancelButton.click();
    expect(cancelSpy).toHaveBeenCalled();
  });
});

