import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  newName = signal('');
  editingId = signal<number | null>(null);
  editName = signal('');
  search = signal('');

  total = computed(() => this.categories().length);
  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.categories().filter(c => c.name.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les catégories.');
        this.loading.set(false);
      }
    });
  }

  add() {
    const name = this.newName().trim();
    if (name.length < 2) {
      this.showToast('Le nom doit contenir au moins 2 caractères', 'error');
      return;
    }
    this.categoryService.create({ name }).subscribe({
      next: () => {
        this.newName.set('');
        this.showToast('Catégorie ajoutée', 'success');
        this.load();
      },
      error: (err) => this.showToast(err.error?.message ?? 'Erreur lors de l\'ajout', 'error')
    });
  }

  startEdit(c: Category) {
    this.editingId.set(c.id);
    this.editName.set(c.name);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit(id: number) {
    const name = this.editName().trim();
    if (name.length < 2) {
      this.showToast('Le nom doit contenir au moins 2 caractères', 'error');
      return;
    }
    this.categoryService.update(id, { name }).subscribe({
      next: () => {
        this.editingId.set(null);
        this.showToast('Catégorie modifiée', 'success');
        this.load();
      },
      error: (err) => this.showToast(err.error?.message ?? 'Erreur lors de la modification', 'error')
    });
  }

  deleteCategory(c: Category) {
    this.confirmDialog.open({
      title: 'Supprimer la catégorie',
      message: `Voulez-vous vraiment supprimer "${c.name}" ?`,
      confirmLabel: 'Supprimer',
      onConfirm: () => {
        this.categoryService.delete(c.id).subscribe({
          next: () => {
            this.showToast('Catégorie supprimée', 'success');
            this.load();
          },
          error: () => this.showToast('Erreur lors de la suppression', 'error')
        });
      }
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}