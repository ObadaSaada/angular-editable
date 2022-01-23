import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'headings-editable-select',
  templateUrl: './headings-editable-select.component.html',
  styleUrls: ['../scss/editable-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeadingsEditableSelectComponent implements OnInit {
  selectedItem: any;
  @Input() title!: string;
  @Input() items: {name: string, tag: string}[]= [];
  @Output() changeHeadings = new EventEmitter<{selectedItem: any}>();

  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = 'None';
  }
  changeEventEmitter(){
    this.changeHeadings.emit({selectedItem: this.selectedItem});
  }
  reset() {
    this.selectedItem = null;
  }
  ngOnInit(): void {
    this.items = [...this.items]
  }
}
