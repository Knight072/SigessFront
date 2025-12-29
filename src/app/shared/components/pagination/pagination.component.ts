import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() page = 0;
  @Input() size = 10;
  @Input() total = 0;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  prev(): void {
    if (this.page > 0) this.pageChange.emit(this.page - 1);
  }

  next(): void {
    if (this.page < this.totalPages - 1) this.pageChange.emit(this.page + 1);
  }

  go(p: number): void {
    const target = Math.max(0, Math.min(this.totalPages - 1, p));
    this.pageChange.emit(target);
  }
}
