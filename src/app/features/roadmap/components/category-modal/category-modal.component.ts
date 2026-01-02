import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapCategory } from '../../../../core/models/roadmap.model';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-content glass-morphism animate-in" (click)="$event.stopPropagation()">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-accent-primary">{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
                <button (click)="close.emit()" class="text-text-dim hover:text-white text-2xl cursor-pointer">✕</button>
            </div>

            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label class="text-xs text-text-dim uppercase">Nombre</label>
                    <input [(ngModel)]="category.name" placeholder="Ej: Java Spring Boot"
                        class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-xs text-text-dim uppercase">Color (Hex)</label>
                    <div class="flex gap-3 items-center">
                        <input type="color" [(ngModel)]="category.color" class="w-10 h-10 rounded bg-transparent border-none">
                        <input [(ngModel)]="category.color" placeholder="#1976D2"
                            class="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary">
                    </div>
                </div>

                <div class="flex justify-end gap-4 mt-4">
                    <button (click)="close.emit()"
                        class="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer">
                        Cancelar
                    </button>
                    <button (click)="save.emit(category)"
                        class="px-6 py-2 rounded-lg bg-accent-primary text-bg-dark hover:bg-accent-primary/80 transition-all text-sm font-bold cursor-pointer">
                        {{ isEdit ? 'Guardar cambios' : 'Crear Categoría' }}
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
        max-width: 500px;
        background: #0a0a0a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .animate-in {
        animation: slideIn 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CategoryModalComponent {
  @Input() category: Partial<RoadmapCategory> = { name: '', icon: 'book', color: '#1976D2' };
  @Input() isEdit = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<RoadmapCategory>>();
}