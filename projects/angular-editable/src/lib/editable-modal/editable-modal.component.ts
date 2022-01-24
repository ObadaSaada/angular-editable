import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EditableModalService } from './editable-modal.service';

@Component({
  selector: 'editable-modal',
  templateUrl: './editable-modal.component.html',
  styleUrls: ['../../../scss/editable-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditableModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  private element: any;

  constructor(private modalService: EditableModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }
  ngOnInit(): void {
    if (!this.id) {
      console.error('modal ID is undefined');
      return;
    }
    document.body.appendChild(this.element);

    // this.element.addEventListener('click', (el: any) => {
    //     if (el.target.className === 'editable-modal') {
    //         this.close();
    //     }
    // });

    this.modalService.add(this);
  }
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
      // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('editable-modal-open');
  }

  // close modal
  close(): void {
      this.element.style.display = 'none';

      document.body.classList.remove('editable-modal-open');
  }
}
