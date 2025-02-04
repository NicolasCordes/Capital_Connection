import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGenaratorService {
  private lastId: number;

  constructor() {
    // Recuperar el último ID guardado o empezar desde 0
    const savedId = localStorage.getItem('lastId');
    this.lastId = savedId ? +savedId : 0;
  }

  generateId(): number {
    this.lastId++;
    localStorage.setItem('lastId', this.lastId.toString());
    return this.lastId;
  }
}
