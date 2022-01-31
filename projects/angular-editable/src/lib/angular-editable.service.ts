import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class AngularEditableService {
savedSelection!: Range | null;
selectedText!: string;
constructor(@Inject(DOCUMENT) private doc: any) { }

exec(type: string, command: string){
  switch (type) {
    case 'fontFamily':
      this.doc.execCommand('fontName',false,command);
      break;
    case 'headings':
        this.doc.execCommand('formatBlock',false,command);
        break;
    case 'textFormat':
      this.doc.execCommand(command,false);
      break;
    case 'createlink':
      this.createLink(command);
      break
    case 'direction':
      this.Direction(command)
    break;
    default: this.doc.execCommand(type, false, command); break;
  }
}
createLink(url: string) {
  let text = this.selectedText;
  let urlPrefix = '';
  if(!url.startsWith('http'))
  {
    urlPrefix = 'http://'
  }
  if(this.selectedText.length < 1){
    text = url;
  }
  const newUrl = '<a href="' + urlPrefix + url + '" target="_blank">' + text + '</a>';
  this.insertHtml(newUrl);
}
insertHtml(html: string): void {
  this.doc.execCommand('insertHTML', false, html);
}
Direction(direction: string)
{
  let SelectedNodes = this.getSelectedNodes().filter(n => n.nodeName.toLocaleLowerCase() === 'p');
  if(SelectedNodes.length > 0)
  {
    SelectedNodes.forEach(p  => (p as HTMLParagraphElement).setAttribute('dir',direction))
  }
  else {
    this.savedSelection?.commonAncestorContainer.parentElement?.setAttribute('dir', direction);
  }
}
insertTable(_cols: number, _rows: number,width?: string) {
  const table = this.doc.createElement('table');
  table.style.width = width? width+'px' : '100%'
  table.style.border = '1px solid black';
  table.style.borderCollapse = 'collapse';
  table.classList.add('table')

  const thead = table.createTHead();
  const r = thead.insertRow(0)
  for(var col = 0; col <_cols; col++)
  {
    const c = r.insertCell(0)
    c.style.border = '1px solid black';
    c.style.borderCollapse = 'collapse';
    c.style.resize = 'horizontal';
    c.style.overflow = 'auto';
    c.innerHTML = '<br>'
  }
  const tboady = table.createTBody()
  for(var row = 0; row < _rows-1; row++)
  {
    const r = tboady.insertRow(0)
    r.style.border = '1px solid black';
    r.style.borderCollapse = 'collapse';
    for(var col = 0; col <_cols; col++)
    {
      const c = r.insertCell(0)
      c.style.border = '1px solid black';
      c.style.borderCollapse = 'collapse';
      c.innerHTML = '<br>'
    }
  }
  this.savedSelection?.insertNode(table)
}
nextNode(node: Node) {
  if (node.hasChildNodes()) {
      return node.firstChild;
  } else {
      while (node && !node.nextSibling) {
          node = node?.parentNode!;
      }
      if (!node) {
          return null;
      }
      return node.nextSibling;
  }
}
getRangeSelectedNodes(range: Range) {
  var node = range.startContainer;
  var endNode = range.endContainer;

  // Special case for a range that is contained within a single node
  if (node == endNode) {
      return [node];
  }

  // Iterate nodes until we hit the end container
  var rangeNodes = [];
  while (node && node != endNode) {
      rangeNodes.push( node = this.nextNode(node)! );
  }

  // Add partially selected nodes at the start of the range
  node = range.startContainer;
  while (node && node != range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node?.parentNode!;
  }

  return rangeNodes;
}
getSelectedNodes() {
  if (window.getSelection) {
      var sel = window.getSelection();
      if (!sel?.isCollapsed) {
          return this.getRangeSelectedNodes(sel!.getRangeAt(0));
      }
  }
  return [];
}
public saveSelection = (): void => {
  if (this.doc.getSelection) {
    const sel = this.doc.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      this.savedSelection = sel.getRangeAt(0);
      this.selectedText = sel.toString();
    }
  } else if (this.doc.getSelection && this.doc.createRange) {
    this.savedSelection = this.doc.createRange();
  } else {
    this.savedSelection = null;
  }
}
restoreSelection(): boolean {
  if (this.savedSelection) {
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.savedSelection);
      return true;
    } else if (this.doc.getSelection /*&& this.savedSelection.select*/) {
      // this.savedSelection.select();
      return true;
    }
  } else {
    return false;
  }
  return false
}
isValidURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
changeTheme(primary: string, secondary: string,toolbarColor: string, light: string, dark1: string, dark2: string, dark3: string) {
  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--secondary-color', secondary);
  document.documentElement.style.setProperty('--gray-level1', toolbarColor);
  document.documentElement.style.setProperty('--light-color', light);
  document.documentElement.style.setProperty('--dark-color', dark1);
  document.documentElement.style.setProperty('--dark-color2', dark2);
  document.documentElement.style.setProperty('--dark-color3', dark3);
}
}
