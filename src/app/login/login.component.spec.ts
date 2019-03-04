import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [AuthenticationService, MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // angular-cli's default test case
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // our unit test cases with karma and jasmine
  it('should show empty login form', () => {
    // showForm: 0 represents login-form
    expect(component.showForm).toBe(0);
    // check if username and password are empty
    expect(component.user).toBeFalsy();
    expect(component.password).toBeFalsy();
  });

  it('should be able to change the shown form', () => {
    // 1 represents registration-form
    component.show(1);
    expect(component.showForm).toBe(1);
  });
});
