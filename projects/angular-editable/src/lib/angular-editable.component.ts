import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditableConfig, IAngularEditableConfig } from './angular-editable.config';
import { AngularEditableService } from './angular-editable.service';
import { EditableModalComponent } from './editable-modal/editable-modal.component';
import { EditableModalService } from './editable-modal/editable-modal.service';
import { ColorsEditableSelectComponent } from './editable-select/colors-editable-select.component';
import { FontFamilyEditableSelectComponent } from './editable-select/font-family-editable-select.component';
import { FontSizeEditableSelectComponent } from './editable-select/font-size-editable-select.component';
import { HeadingsEditableSelectComponent } from './editable-select/headings-editable-select.component';

@Component({
  selector: 'lib-angular-editable',
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

  @Output('blur') blurEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @HostBinding('attr.tabindex') tabindex = -1;

  validURL: boolean = true;
  selectedImage: any;

  constructor(
  private elementRef: ElementRef,
  private renderer: Renderer2,
  private sanitizer: DomSanitizer,
  private service: AngularEditableService,
  private editableModalService: EditableModalService
  ) { }

  private onTouched = () => {};
  registerOnTouched(onTouched: () => void) { this.onTouched = onTouched; }

  private onChange: (value: string) => void = () => {};
  registerOnChange(onChange: (value: string) => void) { (e: string) => (e === '<br>' ? onChange('') : onChange(e)); }

  @HostListener('focus')
  onFocus() {
    this.focus
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
      event.preventDefault();
      const text = event!.clipboardData!.getData('text/plain');
      this.service.exec('insertHTML', text)
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
  openURLModal(id: string) {
    this.service.restoreSelection()
    this.editableModalService.open(id);
  }
  submitURLModal(id: string, url: any) {
    if(!this.isValidURL(url.value))
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
  openSizeModel(id:string, image:any){
    this.openURLModal(id)
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
    if(this.isValidURL(url.value))
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
        // var range = document.createRange();
        // //this.elementRef.nativeElement.focus();
        // range.setStart(this.editorElement.nativeElement,0);
        // range.setEnd(this.editorElement.nativeElement, 0)


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
        if(image.parentElement.nodeName.toLowerCase() === 'p'){
          recentImage = image;
          //recentImage.style.width="100%"
          //recentImage.style.height="100%"
          recentImage.addEventListener('click', (e:any) => {
            this.openSizeModel('changeImageSize', e.srcElement)

          })
        }
      });

    }
  }
  private isValidURL(str: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
}


