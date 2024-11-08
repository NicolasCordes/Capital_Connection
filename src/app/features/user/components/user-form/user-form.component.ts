import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { AddressFormComponent } from "../../address-form/address-form.component";
import { Address } from "../../models/address.model";
import { UserService } from "../../service/user.service";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule, RouterModule, AddressFormComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']

})
export class UserFormComponent {

  fb = inject(FormBuilder);
  userService = inject(UserService);
  router = inject(Router);

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    wallet: ['', Validators.required],
    yearsOfExperience: ['', Validators.required],
    industry: ['', Validators.required],
    address: this.fb.group({  // Agregar un grupo de dirección
      street: [''],
      number: [''],
      locality: [''],
      province: [''],
      type: ['']
    })
  });

  onAddressAdded(address: Address) {
    this.userForm.patchValue({ address: address });
  }

  onSubmit() {
    if (this.userForm.invalid || !this.isAddressFilled()) { return; }
    const user = this.userForm.getRawValue();
    this.userService.postUser(user).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
  isAddressFilled(): boolean {
    const address = this.userForm.get('address')?.value;
    // Verificar que todos los campos de la dirección estén llenos
    return address && address.street && address.number && address.locality && address.province && address.type;
  }
  // Getter para el formulario de dirección
  get addressForm() {
    return this.userForm.get('address') as FormGroup;
  }
}