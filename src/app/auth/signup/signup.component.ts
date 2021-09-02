import { OnDestroy, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSatusSub: Subscription;
  checkEmail = false;
  email: string;
  password: string;
  gender: string;
  passwordIsSame = true;
  private typeSubmit: string = "none";

  constructor(public authService: AuthService) { };

  ngOnInit() {
    this.authSatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    if (this.gender && !this.typeSubmit.localeCompare("customer"))
      this.authService.createCustomer(this.email, this.password, form.value.name, form.value.phonenumber, this.gender);
    else if (!this.typeSubmit.localeCompare("deliveryCompany"))
      this.authService.createDeliveryCompany(this.email, this.password, form.value.name, form.value.phonenumber);
  }

  onCheckExistEmail(form: NgForm) {
    if (form.value.password1 == form.value.password2) {
      this.passwordIsSame = true;
      this.authService.checkExistUserAndSendEmail(form.value.email);
      this.email = form.value.email;
      this.password = form.value.password1;
    }
    else this.passwordIsSame = false;
  }

  chooseMale() {
    this.gender = "M";
    document.getElementById("register__info-gender-choose").innerText = "Nam";
  }

  chooseFemale() {
    this.gender = "F";
    document.getElementById("register__info-gender-choose").innerText = "Nữ";
  }

  chooseAnotherGender() {
    this.gender = "N";
    document.getElementById("register__info-gender-choose").innerText = "Khác";
  }

  onCustomer() {
    this.typeSubmit = "customer";
    document.getElementById("register__info-type-choose").innerText = "Người dùng cá nhân";
    document.getElementById("register__info-phone--btn").style.display = "none";
    document.getElementById("register__info-gender").style.display = "block";
    document.getElementById("register__info-confirm").style.display = "none";
  }

  onDeliveryCompany() {
    this.typeSubmit = "deliveryCompany";
    document.getElementById("register__info-type-choose").innerText = "Doanh nghiệp vận chuyển";
    document.getElementById("register__info-phone--btn").style.display = "block";
    document.getElementById("register__info-gender").style.display = "none";
    document.getElementById("register__info-confirm").style.display = "block";
  }

  registerButtonContinue() {
    document.getElementById("register__confirm").style.display = "none";
    document.getElementById("register__info").style.display = "flex";
  }

  onGender() {
    const gender2 = document.getElementById("register__info-gender-menu");
    if (gender2.style.display == 'block') { gender2.style.display = 'none' } else { gender2.style.display = 'block' }
  }

  onTypeSubmit() {
    const type2 = document.getElementById("register__info-type-menu");
    if (type2.style.display == 'block') { type2.style.display = 'none' } else { type2.style.display = 'block' }
  }

  ngOnDestroy() {
    if (this.authSatusSub) {
      this.authSatusSub.unsubscribe();
    }
  }
}
