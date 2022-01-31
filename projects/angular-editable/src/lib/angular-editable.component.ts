import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditableConfig, IAngularEditableConfig } from './angular-editable.config';
import { AngularEditableService } from './angular-editable.service';
import { EditableModalService } from './editable-modal/editable-modal.service';
import { ColorsEditableSelectComponent } from './editable-select/colors-editable-select.component';
import { FontFamilyEditableSelectComponent } from './editable-select/font-family-editable-select.component';
import { FontSizeEditableSelectComponent } from './editable-select/font-size-editable-select.component';
import { HeadingsEditableSelectComponent } from './editable-select/headings-editable-select.component';

@Component({
  selector: 'angular-editable',
  templateUrl: './angular-editable.component.html',
  styleUrls: ['../../scss/angular-editable.component.scss']
  , providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularEditableComponent),
      multi: true,
    },
  ],
})
export class AngularEditableComponent implements ControlValueAccessor {
  @ViewChild('headings') headingsComp!:  HeadingsEditableSelectComponent;
  @ViewChild('fontSize') fontSizesComp!:  FontSizeEditableSelectComponent;
  @ViewChild('fontFamily') fontFamiliesComp!:  FontFamilyEditableSelectComponent;
  @ViewChild('foreColor') foreColorComp!:  ColorsEditableSelectComponent;
  @ViewChild('backColor') backColorComp!:  ColorsEditableSelectComponent;
  @ViewChild('editor') editorElement!: ElementRef;
  @ViewChild('SelectedImage') selectImage!: ElementRef;

  @Input() config: IAngularEditableConfig = AngularEditableConfig;
  @Input() customButtons: { id:string, text:string, value:string }[] = [];
  @Output('blur') blurEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output('change') changeEvent: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  @HostBinding('attr.tabindex') tabindex = -1;

  validURL: boolean = true;
  selectedImage: any;

  constructor(
  private elementRef: ElementRef,
  private renderer: Renderer2,
  private sanitizer: DomSanitizer,
  private service: AngularEditableService,
  private editableModalService: EditableModalService,
  ) {
    this.service.changeTheme(
      this.config.style.primary!,
      this.config.style.secondary!,
      this.config.style.toolbarColor!,
      this.config.style.light!,
      this.config.style.dark1!,
      this.config.style.dark2!,
      this.config.style.dark3!)
  }

  private onTouched = () => {};
  registerOnTouched(onTouched: () => void) { this.onTouched = onTouched; }

  private onChange: (value: string) => void = (v:any) => { this.changeEvent.emit(v) };
  registerOnChange(onChange: (value: string) => void) { (e: string) => (e === '<br>' ? onChange('') : onChange(e)); }

  @HostListener('focus')
  onFocus() {
    this.focus
  }
  customButtonClick(button: any) {
    let data = button!.value
    let regex = /<(?!(\/\s*)?(a|b|i|em|s|q|blockquote|strong|small|mark|u|table|tr|th|td|thead|tbody|ul|ol|li|img|h1|h2|h3|h4|h5|h6|p|hr|br|pre|sub|sup)[>,\s])([^>])*>/g;
    data = data.replace(regex, '');
    this.service.exec('insertHTML', data)
  }
  focus() {
    this.elementRef.nativeElement.focus();
  }
  editorChanged(el: any) {
    let html = el.innerHTML;
    if ((!html || html === '<br>')) {
      html = '';
    }
    if (typeof this.onChange === 'function') {
      this.onChange(this.sanitizer.sanitize(SecurityContext.HTML, html)!);
    }

  }
  onPaste(event: ClipboardEvent){
      let data = event!.clipboardData!.getData('text/html') || event!.clipboardData!.getData('text/plain');
      let regex = /<(?!(\/\s*)?(a|b|i|em|s|q|blockquote|strong|small|mark|u|table|tr|th|td|thead|tbody|ul|ol|li|img|h1|h2|h3|h4|h5|h6|p|hr|br|pre|sub|sup)[>,\s])([^>])*>/g;
      data = data.replace(regex, '');
      event.preventDefault();
      this.service.exec('insertHTML', data)
  }
  editorFocused(event: FocusEvent) {
    this.focusEvent.emit(event);
  }
  editorBlured(event: FocusEvent){
     this.service.saveSelection();
     if (typeof this.onTouched === 'function') {
       this.onTouched();
     }
  }
  editorMouseOut(){ this.service.saveSelection();}
  editorMouseUp() {this.service.saveSelection()}
  editorMouseDown() {this.service.saveSelection(); }
  editorKeyUp() {this.service.saveSelection()}
  clickEvent() {this.service.saveSelection()}

  setDisabledState(disabled: boolean) {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      String(!disabled),
    );
  }

  writeValue(value: string | null) {
    this.renderer.setProperty(
       this.elementRef.nativeElement,
      'innerHTML',
      AngularEditableComponent.processValue(value),
    );
  }
  execute(type: string, command: any){
    this.service.restoreSelection();
    this.service.exec(type, command);
  }
  private static processValue(value: string | null): string {
    const processed = value || '';
    return processed.trim() === '<br>' ? '' : processed;
  }
  openModal(id: string) {
    this.service.restoreSelection()
    this.editableModalService.open(id);
  }
  submitURLModal(id: string, url: any) {
    if(!this.service.isValidURL(url.value))
    {
      this.validURL = false;
      return;
    }
    else {
      const selection = this.service.savedSelection!;
      if (selection && selection?.commonAncestorContainer?.parentElement?.nodeName === 'A') {
        const parent = selection.commonAncestorContainer.parentElement as HTMLAnchorElement;
        if (parent.href !== '') {
          url = parent.href;
          this.execute('createlink',url)
          this.closeModel(id,[]);
          return
        }
      }
      this.execute('createlink',url.value);
      this.closeModel(id,[url]);
      }
  }
  openSizeModal(id:string, image:any){
    this.openModal(id)
    this.selectedImage = image;
  }
  submitSizeModal(id: string, width: any, height: any) {
    this.renderer.setStyle(this.selectedImage,'width', width.value + 'px')
    this.renderer.setStyle(this.selectedImage,'height', height.value + 'px')
    this.closeModel(id,[width,height]);

  }
  resetSizeModal(id: string) {
    this.renderer.removeStyle(this.selectedImage,'width')
    this.renderer.removeStyle(this.selectedImage,'height')
    this.closeModel(id,[]);
  }
  closeModel(id:string, modalContent: any[]) {
    this.editableModalService.close(id)
    if(modalContent.length > 0) {
      modalContent.forEach((element:any) => {
        if(typeof element === 'object')
        element.value=''
      });
    }
  }
  inputChange(url: any) {
    if(this.service.isValidURL(url.value))
    {
      this.validURL = true;
      return;
    }
    this.validURL = false;
  }
  openFileDialog() {
    this.selectImage.nativeElement.click()
  }
  handleFileDialogChange(event: any) {
    if(document.getSelection.length <= 0)
    {
      this.editorElement.nativeElement.focus();
    }
    var file = event.target.files[0];
    var reader  = new FileReader();
    if(file){
      reader.readAsDataURL(file);
    };
    reader.onload = () => {
      if(reader.result){
        this.execute('insertImage', reader.result);
      }
    }
    reader.onloadend = () => {
      let recentImage: any
      let selectedImages: any= this.editorElement.nativeElement.querySelectorAll('img')
      selectedImages.forEach((image:any) => {
          recentImage = image;
          recentImage.addEventListener('click', (e:any) => {
            this.openSizeModal('changeImageSize', e.srcElement)
          })
      });
      this.selectImage.nativeElement.value='';
    }
  }
  openTableDialog(id: string) {
    this.openModal(id)
  }
  submitTableModal(id: string, cols: any, rows: any, width: any)
  {
    this.service.insertTable(cols.value, rows.value, width.value.toString())
    this.closeModel(id,[cols,rows,width])
    this.editorChanged(this.editorElement.nativeElement)
  }
}


