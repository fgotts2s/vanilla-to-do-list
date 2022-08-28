/**
 * Class representing the to-do list's dynamic data structure.
 */
class VanillaToDoListPreviewModel {
  /**
   * Retrieve a to-do list object from local storage if available or create one.
   * @param {string} id - The to-do list's ID.
   */
  constructor(id) {
    this.toDoListId = +id;
    this.toDoList = {};
    this.toDoLists = JSON.parse(localStorage.getItem('toDoLists')) || [];
    if (this.toDoLists.length > 0) {
      this.toDoList = this.toDoLists.find(toDoList => {
        return toDoList.id === this.toDoListId;
      }) || {};
    }
    this.toDoList.items = this.toDoList.items || [];
  }
  /**
   * Method to bind a callback for when the to-do list changed.
   * @param {function} callback - A callback function executed when the to-do list changed.
   */
  bindToDoListChanged(callback) {
    this.onToDoListChanged = callback;
  }
}

/**
 * Class representing a visual representation of the to-do list's dynamic data structure.
 */
class VanillaToDoListPreviewView {
  /**
   * Create a visual representation of the to-do list.
   */
  constructor() {
    this.style = `
      :host {
        --cyan: rgba(0, 157, 224, 1.0);
        --gray: rgba(128, 128, 128, 1.0);
        font-family: 'Montserrat', sans-serif;
        text-align: center;
        color: initial;
      }
      .hidden {
        display: none;
      }
      header h1 {
        position: relative;
        margin: 0.25em 0 0 0;
        font-size: 3em;
        font-family: 'Arvo', sans-serif;
        letter-spacing: 0.05em;
      }
      header h1 span#first-o,
      header h1 span#second-o {
        display: inline-block;
        color: transparent;
      }
      header h1 span#first-o::before,
      header h1 span#second-o::before {
        content: '';
        display: inline-block;
        margin: 0 -0.6em 0 0;
        border-radius: 50%;
        box-sizing: border-box;
        width: 0.55em;
        height: 0.55em;
      }
      header h1 span#first-o::before {
        border: 0.12em solid var(--cyan);
        background: transparent;
      }
      header h1 span#second-o::before {
        background: var(--cyan);
      }
      header h1::after {
        content: '';
        position: absolute;
        margin: 0 0 0 0.25em;
        width: 0.5em;
        height: 0.5em;
        background: url('/vanilla-to-do-list/img/javascript.svg') no-repeat;
      }
      header h2 {
        margin: 0;
      }
      header h2.done {
        display: inline-block;
        background: linear-gradient(to right, transparent 0, currentcolor 0) no-repeat right center / 100% 0.1em;
        color: var(--gray);
      }
      section.to-do-list ul.to-do-list {
        padding: 0;
        text-align: start;
        list-style: none;
      }
      section.to-do-list ul.to-do-list li {
        position: relative;
        padding: 0.5em;
      }
      section.to-do-list ul.to-do-list li input[type=checkbox].select {
        appearance: none;
        position: relative;
        bottom: 0.1em;
        margin: 0 0.5em 0 0;
        font-size: inherit;
        vertical-align: middle;
      }
      section.to-do-list ul.to-do-list li.pending input[type=checkbox].select,
      section.to-do-list ul.to-do-list li.done input[type=checkbox].select {
        display: inline-block;
        border-radius: 50%;
        box-sizing: border-box;
        width: 1em;
        height: 1em;
      }
      section.to-do-list ul.to-do-list li.pending input[type=checkbox].select {
        border: 0.2em solid var(--cyan);
        background: transparent;
      }
      section.to-do-list ul.to-do-list li.done input[type=checkbox].select {
        border: 0.5em solid var(--cyan);
        background: var(--cyan);
      }
      section.to-do-list ul.to-do-list li label.text {
        --strikethrough: 0;
        background: linear-gradient(to right, transparent 0, currentcolor 0) no-repeat right center / calc(var(--strikethrough) * 100%) 0.1em;
        background-position-x: left;
        cursor: text;
        word-break: break-all;
      }
      section.to-do-list ul.to-do-list li.done label.text {
        --strikethrough: 1;
        color: var(--gray);
      }
      footer {
        margin: 1em 0 3em 0;
      }
      footer span#count {
        position: relative;
        float: left;
        opacity: 1;
        padding: 0;
        color: var(--gray);
      }
    `;
    this.template = `
      <header>
        <h1>t<span id="first-o">o</span>-d<span id="second-o">o</span> list</h1>
        <h2 class="hidden"></h2>
      </header>
      <section class="to-do-list"></section>
      <hr class="hidden">
      <footer class="hidden">
        <span id="count" class="hidden"></span>
      </footer>
    `;
    this.nodeStyle = this.#createElement('style');
    this.nodeStyle.innerHTML = this.style;
    this.nodeSectionContainer = this.#createElement('section', 'container');
    this.nodeSectionContainer.innerHTML = this.template;
  }
  /**
   * Private method to create a new HTML element.
   * @param {string} elementName - The name of the new HTML element.
   * @param {array} classList - An optional list of HTML class attribute values.
   */
  #createElement(elementName, ...classList) {
    const element = document.createElement(elementName);
    if (classList.length > 0) {
      element.classList.add.apply(element.classList, classList);
    }
    return element;
  }
  /**
   * Method to render the to-do list preview.
   * @param {object} toDoList - The to-do list for the preview to render.
   */
  render(toDoList) {
    let toDoListItems = toDoList.items;
    if (toDoList.name !== undefined && toDoList.done !== undefined) {
      const nodeHeadingTwo = this.nodeSectionContainer.querySelector('header h2');
      const headingTwoClass = toDoList.done === false ? 'pending' : 'done';
      nodeHeadingTwo.textContent = toDoList.name;
      nodeHeadingTwo.classList.add(headingTwoClass);
      nodeHeadingTwo.classList.remove('hidden');
    }
    const nodeSectionToDoList = this.nodeSectionContainer.querySelector('section.to-do-list');
    // First, remove any existing child nodes respectively the paragraph or the to-do list.
    nodeSectionToDoList.replaceChildren();
    const nodeHorizontalRule = this.nodeSectionContainer.querySelector('hr');
    const nodeFooter = this.nodeSectionContainer.querySelector('footer');
    const nodeCountToDoListItems = this.nodeSectionContainer.querySelector('footer span#count');
    if (toDoListItems.length > 0) {
      const toDoListItemsPending = toDoListItems.filter(toDoListItem => {
        return toDoListItem.done !== true;
      });
      const toDoListItemsDone = toDoListItems.filter(toDoListItem => {
        return toDoListItem.done !== false;
      });
      const countToDoListItemsAll = toDoListItems.length;
      const countToDoListItemsPending = toDoListItemsPending.length;
      const countToDoListItemsDone = toDoListItemsDone.length;
      const nodeToDoList = this.#createElement('ul', 'to-do-list');
      nodeSectionToDoList.append(nodeToDoList);
      toDoListItems.forEach(toDoListItem => {
        const listItemClass = toDoListItem.done === false ? 'pending' : 'done';
        const nodeListItem = this.#createElement('li', listItemClass);
        nodeListItem.id = toDoListItem.id;
        const nodeListItemSelect = this.#createElement('input', 'select');
        nodeListItemSelect.type = 'checkbox';
        nodeListItemSelect.checked = toDoListItem.done;
        const nodeListItemText = this.#createElement('label', 'text');
        nodeListItemText.dataset.created = toDoListItem.created;
        if (toDoListItem.lastUpdated !== null) {
          nodeListItemText.dataset.lastModified = toDoListItem.lastUpdated;
        }
        nodeListItemText.textContent = toDoListItem.text;
        nodeListItem.append(nodeListItemSelect, nodeListItemText);
        nodeToDoList.append(nodeListItem);
      });
      nodeHorizontalRule.classList.remove('hidden');
      nodeFooter.classList.remove('hidden');
      nodeCountToDoListItems.textContent = `${countToDoListItemsAll} (${countToDoListItemsPending}/${countToDoListItemsDone})`;
      nodeCountToDoListItems.classList.remove('hidden');
    } else {
      if (toDoList.id !== undefined) {
        const nodeNothingToDo = this.#createElement('p');
        nodeNothingToDo.textContent = 'Good for you: There\'s nothing to do!';
        nodeSectionToDoList.append(nodeNothingToDo);
      } else {
        const nodeInvalidId = this.#createElement('p');
        nodeInvalidId.textContent = 'Invalid ID!';
        nodeSectionToDoList.append(nodeInvalidId);
      }
      nodeHorizontalRule.classList.add('hidden');
      nodeFooter.classList.add('hidden');
    }
  }
}

/**
 * Class representing a link between the to-do list's dynamic data structure (model) and its visual representation (view).
 */
class VanillaToDoListPreviewController {
  /**
   * Link the model and the view.
   * @param {object} model - The to-do list's dynamic data structure.
   * @param {object} view - The visual representation of the to-do list's dynamic data structure.
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindToDoListChanged(this.onToDoListChanged);
    this.onToDoListChanged(this.model.toDoList);
  }
  /**
   * Method for when the to-do list changed.
   * @param {object} toDoList - The changed to-do list.
   */
  onToDoListChanged = (toDoList) => {
    this.view.render(toDoList);
  }
}

/**
 * Class representing a custom element to insert a to-do list preview to the document.
 * @extends HTMLElement
 */
export class VanillaToDoListPreview extends HTMLElement {
  /**
   * Static method to observe custom element's attributes.
   */
  static get observedAttributes() {
    return ['id'];
  }
  /**
   * Method to get the ID attribute's value.
   */
  get id() {
    return this.getAttribute('id');
  }
  /**
   * Method to set the ID attribute's value.
   */
  set id(value) {
    if (value) {
      this.setAttribute('id', value);
    } else {
      this.removeAttribute('id');
    }
  }
  /**
   * Create the custom element and attach its visual representation to the shadow DOM.
   */
  constructor() {
    super();
    this.application = new VanillaToDoListPreviewController(new VanillaToDoListPreviewModel(this.id), new VanillaToDoListPreviewView());
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.append(this.application.view.nodeStyle, this.application.view.nodeSectionContainer);
  }
}

/**
 * Register a new custom element to eventually be able to insert a to-do list preview to the document.
 */
customElements.define('vanilla-to-do-list-preview', VanillaToDoListPreview);
