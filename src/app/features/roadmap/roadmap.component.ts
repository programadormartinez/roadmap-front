import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../core/services/roadmap.service';
import { AuthService } from '../../core/services/auth.service';
import { RoadmapCategory, RoadmapItem, RoadmapItemDTO } from '../../core/models/roadmap.model';
import { FormsModule } from '@angular/forms';
import { ItemModalComponent } from './components/item-modal/item-modal.component';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemModalComponent,
    CategoryModalComponent,
    DeleteConfirmModalComponent,
  ],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css',
})
export class RoadmapComponent implements OnInit {
  private roadmapService = inject(RoadmapService);
  private authService = inject(AuthService);

  categories = this.roadmapService.getRoadmap();
  selectedCategory = signal<RoadmapCategory | null>(null);

  // Modal states
  isItemModalOpen = signal(false);
  isCategoryModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  // Form states
  itemForm = signal<RoadmapItemDTO>({} as RoadmapItemDTO);
  isEditItem = signal(false);
  categoryForm = signal<Partial<RoadmapCategory>>({});
  isEditCategory = signal(false);

  constructor() {
    effect(() => {
      const currentData = this.categories();
      if (currentData.length > 0 && !this.selectedCategory()) {
        this.selectedCategory.set(currentData[0]);
      }

      const currentCat = this.selectedCategory();
      if (currentCat) {
        const updatedCat = currentData.find((c) => c.id === currentCat.id);
        if (updatedCat && updatedCat !== currentCat) {
          this.selectedCategory.set(updatedCat);
        }
      }
    });
  }

  ngOnInit() {
    this.roadmapService.fetchRoadmap();
  }

  selectCategory(category: RoadmapCategory) {
    this.selectedCategory.set(category);
  }

  // Item Actions
  openAddItem() {
    const currentCat = this.selectedCategory();
    if (currentCat) {
      this.itemForm.set({
        title: '',
        description: '',
        categoryId: currentCat.id,
        status: 'PENDING',
        progress: 0,
        links: [],
        learned: '',
        application: '',
        additions: '',
      });
      this.isEditItem.set(false);
      this.isItemModalOpen.set(true);
    }
  }

  selectItem(item: RoadmapItem) {
    const currentCat = this.selectedCategory();
    if (currentCat) {
      this.itemForm.set({
        id: item.id,
        title: item.title,
        description: item.description,
        categoryId: currentCat.id,
        status: item.status,
        progress: item.progress,
        links: item.links || [],
        learned: item.notes?.learned || '',
        application: item.notes?.application || '',
        additions: item.notes?.additions || '',
      });
      this.isEditItem.set(true);
      this.isItemModalOpen.set(true);
    }
  }

  saveItemChanges(itemDto: RoadmapItemDTO) {
    if (this.isEditItem() && itemDto.id) {
      this.roadmapService.updateItemFull(itemDto.id, itemDto).subscribe({
        next: () => {
          this.isItemModalOpen.set(false);
        },
        error: (err) => console.error('Error updating item', err),
      });
    } else {
      this.roadmapService.addItem(itemDto).subscribe({
        next: () => {
          this.isItemModalOpen.set(false);
        },
        error: (err) => console.error('Error adding item', err),
      });
    }
  }

  toggleItemStatus(item: RoadmapItem) {
    const newStatus = item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const newProgress = newStatus === 'COMPLETED' ? 100 : 0;

    const currentCat = this.selectedCategory();
    if (currentCat) {
      this.roadmapService.updateItem(currentCat.id, item.id, {
        status: newStatus,
        progress: newProgress,
      });
    }
  }

  // Category Actions
  openAddCategory() {
    this.categoryForm.set({ name: '', icon: 'book', color: '#1976D2' });
    this.isEditCategory.set(false);
    this.isCategoryModalOpen.set(true);
  }

  openEditCategory(event: Event, category: RoadmapCategory) {
    event.stopPropagation();
    this.categoryForm.set({ ...category });
    this.isEditCategory.set(true);
    this.isCategoryModalOpen.set(true);
  }

  saveCategory(category: Partial<RoadmapCategory>) {
    if (this.isEditCategory() && category.id) {
      this.roadmapService.updateCategory(category.id, category).subscribe(() => {
        this.isCategoryModalOpen.set(false);
        if (this.selectedCategory()?.id === category.id) {
          this.selectedCategory.set(category as RoadmapCategory);
        }
      });
    } else {
      const userId = this.authService.getUserId();
      if (userId) {
        const newCategory = { ...category, userId };
        this.roadmapService.addCategory(newCategory).subscribe(() => {
          this.isCategoryModalOpen.set(false);
        });
      } else {
        console.error('User not authenticated');
      }
    }
  }

  openDeleteCategory(event: Event, category: RoadmapCategory) {
    event.stopPropagation();
    this.categoryForm.set(category);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const id = this.categoryForm().id;
    if (id) {
      this.roadmapService.deleteCategory(id).subscribe(() => {
        this.isDeleteModalOpen.set(false);
        if (this.selectedCategory()?.id === id) {
          this.selectedCategory.set(this.categories()[0] || null);
        }
      });
    }
  }

  getOverallProgress() {
    const items = this.selectedCategory()?.items || [];
    if (items.length === 0) return 0;

    const totalProgress = items.reduce((acc, item) => acc + (item.progress || 0), 0);
    return Math.round(totalProgress / items.length);
  }
}
