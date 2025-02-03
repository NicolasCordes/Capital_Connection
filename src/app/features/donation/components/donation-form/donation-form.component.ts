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
  private scriptElement?: HTMLScriptElement;
  private walletInstance: any;

  ngOnInit(): void {
    this.authService.auth().subscribe({
      next:(user: ActiveUser | undefined) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    }, error:(e:Error)=>{
      console.log(e.message);
    }});



      // Continuar con la carga del script de MercadoPago
      this.mpService.crearPreferencia("Producto de prueba", 1000).subscribe(
        response => {
          const preferenceId = response.id; // Asegurarse de obtener el preference_id

          if (!document.querySelector(`script[src="${environment.scriptMercadoPago}"]`)) {
            this.scriptElement = document.createElement('script');
            this.scriptElement.src = environment.scriptMercadoPago;
            this.scriptElement.onload = () => this.initMercadoPago(preferenceId); // Pasar el preference_id aquí
            this.scriptElement.onerror = err => {
              console.error('Error cargando MercadoPago:', err);
            };
            document.head.appendChild(this.scriptElement);
          } else {
            this.initMercadoPago(preferenceId); // Si ya está cargado, solo inicializar
          }
        },
        error => {
          console.error("Error al crear la preferencia de pago:", error);
        }
      );

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

    console.log('Métodos disponibles en bricksBuilder:', Object.keys(bricksBuilder));

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
      .then((instance: any) => (this.walletInstance = instance));
  } else {
    console.error('MercadoPago no está definido');
  }
}


  donationForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],

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

  constructor(private fb: FormBuilder, private donationService: DonationService, private mpService: MpService) {}
  onSubmit() {

    const newDonation: Donation = {
      amount: BigInt(this.donationForm.value.amount ?? 0),
      date: new Date(),
      id_user: this.activeUser?.id,
      id_entrepreneurship: this.idE,
      isActivated: true
    };


  }

}
