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
          <!-- Recursos/Enlaces Section -->
          <div class="flex flex-col gap-2">
            <label class="text-xs text-text-dim uppercase flex justify-between items-center">
              Recursos / Enlaces
              <button
                type="button"
                (click)="addLink()"
                class="text-accent-primary hover:text-accent-primary/80 text-xs px-2 py-1 border border-accent-primary/30 rounded cursor-pointer"
              >
                + Agregar enlace
              </button>
            </label>
            <div class="flex flex-col gap-2">
              @if(item.links && item.links.length > 0) {
                @for(link of item.links; track $index) {
                  <div class="flex gap-2 items-center bg-white/5 border border-white/10 rounded-lg p-2">
                    <input
                      [(ngModel)]="item.links[$index]"
                      placeholder="https://..."
                      class="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      (click)="removeLink($index)"
                      class="text-red-400 hover:text-red-300 text-sm cursor-pointer px-2"
                    >
                      ✕
                    </button>
                  </div>
                }
              } @else {
                <p class="text-xs text-text-dim italic">No hay recursos agregados aún</p>
              }
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs text-text-dim uppercase">Título</label>
            <input
              [(ngModel)]="item.title"
              placeholder="Ej: Arquitectura Hexagonal"
              class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary "
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs text-text-dim uppercase">Descripción</label>
            <textarea
              [(ngModel)]="item.description"
              placeholder="Breve descripción del tema..."
              class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary h-20 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Estado</label>
              <select
                [(ngModel)]="item.status"
                class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary"
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase flex justify-between">
                Progreso <span>{{ item.progress }}%</span>
              </label>
              <input
                type="range"
                [(ngModel)]="item.progress"
                class="w-full accent-accent-primary"
              />
            </div>
          </div>

          

          @if(isEdit){
          <div class="space-y-4">
            <!-- Enlaces relacionados en modo lectura (clickeables) -->
            @if(item.links && item.links.length > 0) {
              <div class="flex flex-col gap-2 mb-4">
                <label class="text-xs text-text-dim uppercase">Enlaces Relacionados</label>
                <div class="flex flex-col gap-2">
                  @for(link of item.links; track $index) {
                    <a
                      [href]="link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 bg-white/5 border border-accent-primary/30 rounded-lg p-3 hover:bg-white/10 transition-all group cursor-pointer"
                    >
                      <span class="text-accent-primary text-sm">🔗</span>
                      <span class="text-sm flex-1 truncate group-hover:text-accent-primary transition-colors">{{ link }}</span>
                      <span class="text-xs text-text-dim group-hover:text-accent-primary">↗</span>
                    </a>
                  }
                </div>
              </div>
            }
            
            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Lo que aprendí</label>
              <textarea
                [(ngModel)]="item.learned"
                placeholder="Conceptos clave..."
                class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Aplicación</label>
              <textarea
                [(ngModel)]="item.application"
                placeholder="Cómo usé esto..."
                class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-text-dim uppercase">Adiciones</label>
              <textarea
                [(ngModel)]="item.additions"
                placeholder="Qué más explorar..."
                class="bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-secondary h-24 resize-none"
              ></textarea>
            </div>
          </div>
          }
          <div class="flex justify-end gap-4 mt-4">
            <button
              (click)="close.emit()"
              class="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              (click)="save.emit(item)"
              class="px-6 py-2 rounded-lg bg-accent-primary text-bg-dark hover:bg-accent-primary/80 transition-all text-sm font-bold cursor-pointer"
            >
              {{ isEdit ? 'Guardar cambios' : 'Crear Tema' }}
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
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      input[type='range'] {
        height: 4px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        outline: none;
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        background: var(--accent-primary);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 10px var(--accent-primary);
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
