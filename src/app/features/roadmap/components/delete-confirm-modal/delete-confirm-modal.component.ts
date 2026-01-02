import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-content glass-morphism animate-in" (click)="$event.stopPropagation()">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-red-500">Confirmar Eliminación</h2>
                <button (click)="close.emit()" class="text-text-dim hover:text-white text-2xl cursor-pointer">✕</button>
            </div>

            <div class="flex flex-col gap-6">
                <p class="text-text-dim">
                    Esta acción es irreversible. Para confirmar, escribe el nombre de la categoría: 
                    <span class="text-white font-bold">"{{ categoryName }}"</span>
                </p>

                <div class="flex flex-col gap-2">
                    <input [(ngModel)]="confirmName" placeholder="Escribe el nombre aquí"
                        class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500">
                </div>

                <div class="flex justify-end gap-4 mt-4">
                    <button (click)="close.emit()"
                        class="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer">
                        Cancelar
                    </button>
                    <button (click)="confirm.emit()" [disabled]="confirmName !== categoryName"
                        class="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold cursor-pointer">
                        Eliminar Definitivamente
                    </button>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        width: 90%;
        max-width: 450px;
        background: #0a0a0a;
        border: 1px solid rgba(255, 0, 0, 0.2);
        border-radius: 24px;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .animate-in {
        animation: slideIn 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class DeleteConfirmModalComponent {
  @Input() categoryName!: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  confirmName = '';
}