import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapItemDTO } from '../../../../core/models/roadmap.model';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content glass-morphism animate-in" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-accent-primary">
            {{ isEdit ? 'Editar Tema' : 'Nuevo Tema' }}
          </h2>
          <button
            (click)="close.emit()"
            class="text-text-dim hover:text-white text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-xs text-text-dim uppercase">Título</label>
            <input
              [(ngModel)]="item.title"
              placeholder="Ej: Arquitectura Hexagonal"
              class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs text-text-dim uppercase">Descripción</label>
            <textarea
              [(ngModel)]="item.description"
              placeholder="Breve descripción del tema..."
              class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-primary h-20 resize-none"
            ></textarea>
          </div>

          <!-- Recursos/Enlaces Section -->
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <label class="text-xs text-text-dim uppercase">Recursos / Enlaces</label>
              <button
                type="button"
                (click)="addLink()"
                class="btn-add-link"
              >
                <span>+ Agregar enlace</span>
              </button>
            </div>
            
            <div class="flex flex-col gap-2">
              @if(item.links && item.links.length > 0) {
                @for(link of item.links; track $index) {
                  <div class="flex gap-2 items-center bg-white/5 border border-white/10 rounded-xl p-2 group">
                    <span class="text-accent-primary ml-2">🔗</span>
                    <input
                      [(ngModel)]="item.links[$index]"
                      placeholder="https://..."
                      class="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      (click)="removeLink($index)"
                      class="text-text-dim hover:text-red-400 text-sm cursor-pointer px-3 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                }
              } @else {
                <div class="p-4 border border-dashed border-white/10 rounded-xl text-center">
                  <p class="text-xs text-text-dim italic">No hay recursos agregados aún</p>
                </div>
              }
            </div>
          </div>

          <!-- Dynamic fields based on Edit Mode -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Estado</label>
              <select
                [(ngModel)]="item.status"
                class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-primary cursor-pointer appearance-none"
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>

            @if(isEdit) {
              <div class="flex flex-col gap-2">
                <label class="text-xs text-text-dim uppercase flex justify-between">
                  Progreso <span>{{ item.progress }}%</span>
                </label>
                <div class="range-container">
                  <input
                    type="range"
                    [(ngModel)]="item.progress"
                    class="w-full"
                  />
                </div>
              </div>
            }
          </div>

          @if(isEdit){
          <div class="space-y-4 pt-4 border-t border-white/10">
            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Lo que aprendí</label>
              <textarea
                [(ngModel)]="item.learned"
                placeholder="Conceptos clave que dominaste..."
                class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Aplicación Práctica</label>
              <textarea
                [(ngModel)]="item.application"
                placeholder="¿Cómo aplicaste este conocimiento?"
                class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Próximos Pasos / Notas</label>
              <textarea
                [(ngModel)]="item.additions"
                placeholder="¿Qué más te gustaría explorar sobre este tema?"
                class="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>
          </div>
          }

          <div class="flex justify-end gap-4 mt-6">
            <button
              (click)="close.emit()"
              class="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              (click)="save.emit(item)"
              class="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-dark hover:scale-[1.02] transition-all text-sm font-bold cursor-pointer"
            >
              {{ isEdit ? 'Guardar Cambios' : 'Crear Tema' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
        max-width: 650px;
        max-height: 90vh;
        overflow-y: auto;
        background: #0d0e12;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 32px;
        padding: 2.5rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .btn-add-link {
        background: rgba(0, 242, 255, 0.1);
        border: 1px solid var(--accent-primary);
        color: var(--accent-primary);
        padding: 0.4rem 1rem;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-add-link:hover {
        background: var(--accent-primary);
        color: var(--bg-dark);
        box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
      }

      .range-container {
        padding: 1rem 0;
      }

      .animate-in {
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      input[type='range'] {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        outline: none;
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: var(--accent-primary);
        border: 3px solid #0d0e12;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 15px rgba(0, 242, 255, 0.5);
        transition: all 0.2s ease;
      }

      input[type='range']::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 0 20px var(--accent-primary);
      }
    `,
  ],
})
export class ItemModalComponent {
  @Input() item!: RoadmapItemDTO;
  @Input() isEdit = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<RoadmapItemDTO>();

  addLink() {
    if (!this.item.links) {
      this.item.links = [];
    }
    this.item.links.push('');
  }

  removeLink(index: number) {
    if (this.item.links) {
      this.item.links.splice(index, 1);
    }
  }
}
