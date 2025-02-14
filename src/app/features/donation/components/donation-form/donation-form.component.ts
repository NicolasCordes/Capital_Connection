declare global {
  interface Window {
    checkoutButton: any;  // O usa un tipo más específico si lo sabes
  }
}

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Donation } from '../../../../types/donation.model';
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { DonationService } from '../../../../services/donation.service';
import MercadoPagoConfig from 'mercadopago';
import { MpService } from '../../../../services/mp.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { environmentMP } from '../../../../../environments/environment';
import { BackendStatusServiceService } from '../../../../services/backend-status-service.service';
declare let MercadoPago: any;

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.css'
})

export class DonationFormComponent implements OnInit{
  @Input() idE!: number;
  @Output() donationAdded: EventEmitter<Donation> = new EventEmitter();
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)
  backendStatusService= inject(BackendStatusServiceService)
  private walletInstance: any;
  payOption:boolean=true;
  pressed:boolean=false;
  amount:BigInt=BigInt(0);
  isBackendAvailable: boolean = false;  // Variable para controlar la disponibilidad del backend

  ngOnInit(): void {

    this.backendStatusService.checkBackendStatus().subscribe(
      () => {
        this.isBackendAvailable = true;  // Backend está disponible
      },
      (error) => {
        console.error('Serivicio de mercadopago no disponible', error);
        this.isBackendAvailable = false;  // Backend no disponible
      }
    );


    this.authService.auth().subscribe({
      next:(user: ActiveUser | undefined) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    }, error:(e:Error)=>{
      console.log(e.message);
    }});
    }

    clearZero(): void {
      // Verifica si el valor es 0 antes de borrarlo
      if (this.donationForm.controls['amount'].value === 0) {
        this.donationForm.controls['amount'].setValue(null);
      }
    }


private initMercadoPago(preferenceId: string): void {
  if (typeof MercadoPago !== 'undefined') {
    const publicKeyMP = environmentMP.publicKeyMP;
    const mp = new MercadoPago(publicKeyMP);
    const bricksBuilder = mp.bricks();

    if (!bricksBuilder) {
      console.error('bricksBuilder no está disponible');
      return;
    }


    if (this.walletInstance) {
      this.walletInstance.unmount();
    }

    if (typeof bricksBuilder.create !== 'function') {
      console.error('El método create no está disponible en bricksBuilder');
      return;
    }

    bricksBuilder
      .create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenceId, // Usar el preferenceId aquí
          redirectMode: 'self',
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
      })
      .then((instance: any) => {
        localStorage.setItem('returnUrl', window.location.href);
        this.walletInstance = instance;
      })
      .catch((error: any) => {
        console.error('Error al crear la billetera de MercadoPago', error);
      });
  } else {
    console.error('MercadoPago no está definido');
  }
}


donationForm = this.fb.group({
  amount: [{ value: 0, disabled: false }, [Validators.required, Validators.min(100)]],
});


  ngOnDestroy(): void {
    // Desmontar la billetera de MercadoPago si existe
    if (this.walletInstance) {
        this.walletInstance.unmount();
    }

    // Eliminar contenido del contenedor de la billetera
    const walletContainer = document.getElementById('wallet_container');
    if (walletContainer) {
        walletContainer.innerHTML = '';
    }
}

  constructor(private fb: FormBuilder, private mpService: MpService, private donationService:DonationService) {}
  pay() {
    if (this.donationForm.valid) {
        this.donationForm.get('amount')?.disable();  // Deshabilita el input correctamente
        this.pressed = true;
        const newDonation: Donation = {
            amount: BigInt(this.donationForm.value.amount ?? 0),
            date: new Date(),
            id_user: this.activeUser?.id,
            id_entrepreneurship: this.idE,
            isActivated: false,
            status: 'pending'
        };
        const serializedDonation = JSON.stringify(newDonation, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );

        this.donationService.createDonation(newDonation.id_user, JSON.parse(serializedDonation)).subscribe(
            (createdDonation: Donation) => {
                if (createdDonation.id && newDonation.id_user) {
                    this.mpService.crearPreferencia('Donacion', 1, Number(newDonation.amount), createdDonation.id, newDonation.id_user).subscribe(
                        response => {
                            const preferenceId = response.id;
                            if (preferenceId) {
                                this.activatepay();
                                this.amount = newDonation.amount;
                                this.initMercadoPago(preferenceId);
                            }
                        },
                        error => {
                            console.error("Error al crear la preferencia de pago:", error);
                            this.pressed = false;
                            this.activatepay();
                            this.amount = BigInt(0);
                        }
                    );
                }
            });
    }
}

  activatepay(){
    this.payOption = !this.payOption
  }



}
