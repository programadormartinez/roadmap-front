import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoadmapCategory, RoadmapItem, RoadmapNotes, RoadmapItemDTO } from '../models/roadmap.model';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoadmapService {
    private http = inject(HttpClient);
    private readonly API_URL = 'https://roadmap-back-production.up.railway.app/api/roadmap';

    private roadmapData = signal<RoadmapCategory[]>([]);

    constructor() {
        this.fetchRoadmap();
    }

    fetchRoadmap() {
        // Usar responseType 'text' para manejar JSON inválido del backend
        this.http.get(this.API_URL + '/categories', { responseType: 'text' }).subscribe({
            next: (text) => {
                try {
                    const data = this.parseRoadmapJSON(text);
                    this.roadmapData.set(data);
                } catch (error) {
                    console.error('Error parsing roadmap JSON:', error);
                    this.roadmapData.set([]);
                }
            },
            error: (err) => console.error('Error fetching roadmap', err)
        });
    }

    private parseRoadmapJSON(text: string): RoadmapCategory[] {
        // Encontrar el primer nivel válido de array antes de las referencias circulares
        let depth = 0;
        let arrayStart = -1;
        let lastValidClosing = -1;
        let bracketDepth = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char === '[') {
                if (arrayStart === -1) arrayStart = i;
                bracketDepth++;
            } else if (char === ']') {
                bracketDepth--;
                // Guardar cada cierre válido de nivel superior
                if (bracketDepth === 0 && arrayStart !== -1) {
                    lastValidClosing = i + 1;
                    break;
                }
            } else if (char === '{') {
                depth++;
            } else if (char === '}') {
                depth--;
                // Si llegamos al primer nivel de objetos cerrados, puede ser un punto válido
                if (depth === 0 && bracketDepth === 1) {
                    lastValidClosing = i + 2; // Incluir ]}
                }
            }
        }

        if (lastValidClosing > 0) {
            try {
                const truncated = text.substring(0, lastValidClosing);
                const parsed = JSON.parse(truncated);
                return this.cleanCircularReferences(parsed);
            } catch (error) {
                console.warn('Intento de parseo truncado falló, intentando parseo completo');
                // Si falla, intentar parsear todo de todas formas
                const parsed = JSON.parse(text);
                return this.cleanCircularReferences(parsed);
            }
        }

        throw new Error('No se pudo encontrar JSON válido en la respuesta');
    }

    private cleanCircularReferences(data: any[]): RoadmapCategory[] {
        return data.map(category => ({
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            items: (category.items || []).map((item: any) => this.cleanItem(item))
        }));
    }

    private cleanItem(item: any): RoadmapItem {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status,
            progress: item.progress,
            notes: item.notes,
            links: item.links || [],
            subItems: (item.subItems || []).map((sub: any) => this.cleanItem(sub))
        };
    }

    getRoadmap() {
        return this.roadmapData.asReadonly();
    }

    addCategory(category: Partial<RoadmapCategory>) {
        return this.http.post<RoadmapCategory>(this.API_URL + '/categories', category).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    updateCategory(id: number, category: Partial<RoadmapCategory>) {
        return this.http.put<RoadmapCategory>(`${this.API_URL}/categories/${id}`, category).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    deleteCategory(id: number) {
        return this.http.delete(`${this.API_URL}/categories/${id}`).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    addItem(item: RoadmapItemDTO) {
        return this.http.post(`${this.API_URL}/items`, item).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    updateItemFull(itemId: number, item: RoadmapItemDTO) {
        return this.http.put(`${this.API_URL}/items/${itemId}`, item).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    saveItemNotes(itemId: number, notes: RoadmapNotes) {
        return this.http.put(`${this.API_URL}/items/${itemId}/notes`, notes).pipe(
            tap(() => this.fetchRoadmap())
        );
    }

    updateItem(categoryId: number, itemId: number, updates: Partial<RoadmapItem>) {
        // Optimistic update for UI responsiveness
        this.roadmapData.update(categories =>
            categories.map(cat => {
                if (cat.id === categoryId) {
                    return {
                        ...cat,
                        items: this.updateNestedItem(cat.items, itemId, updates)
                    };
                }
                return cat;
            })
        );
    }

    private updateNestedItem(items: RoadmapItem[], itemId: number, updates: Partial<RoadmapItem>): RoadmapItem[] {
        return items.map(item => {
            if (item.id === itemId) {
                return { ...item, ...updates };
            }
            if (item.subItems && item.subItems.length > 0) {
                return {
                    ...item,
                    subItems: this.updateNestedItem(item.subItems, itemId, updates)
                };
            }
            return item;
        });
    }
}
