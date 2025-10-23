import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-promotions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-promotions.component.html',
  styleUrl: './bank-promotions.component.css'
})
export class BankPromotionsComponent {

  banks = [
  { name: 'Galicia', logo: 'bank-logos/bco-galicia.svg' },
  { name: 'Macro', logo: 'bank-logos/bco-macro.svg' },
  { name: 'HSBC', logo: 'bank-logos/bco-hsbc.svg' },
  { name: 'Santander', logo: 'bank-logos/bco-santander.svg' },
  { name: 'Credicoop', logo: 'bank-logos/bco-credicoop.svg' },
  { name: 'Nación', logo: 'bank-logos/bco-nacion.svg' }
];

  promotions = [
    {
      bank: 'Banco Galicia',
      description: '12 cuotas sin interés en libros del género terror',
      discount: 10
    },
    {
      bank: 'Santander',
      description: '6 cuotas sin interés en todos los libros',
      discount: 15
    }
  ];
}
