/**
 * Class representing the to-do list's dynamic data structure.
 */
class VanillaToDoListModel {
  /**
   * Retrieve a to-do list object from local storage if available.
   * @param {string} id - The to-do list's ID.
   */
  constructor(id) {
    this.toDoListId = +id;
    this.toDoList = {};
    // Retrieve a to-do lists array from local storage if available or create an empty one.
    this.toDoLists = JSON.parse(localStorage.getItem('toDoLists')) || [];
    if (this.toDoLists.length > 0) {
      // Within the to-do lists array find the to-do list associated with the passed ID.
      this.toDoList = this.toDoLists.find(toDoList => {
        return toDoList.id === this.toDoListId;
      }) || {};
    }
    // In case there are no to-do list items assign an empty array.
    this.toDoList.items = this.toDoList.items || [];
  }
  /**
   * Method to bind a callback for when the to-do list changed.
   * @param {function} callback - A callback function executed when the to-do list changed.
   */
  bindToDoListChanged(callback) {
    this.onToDoListChanged = callback;
  }
  /**
   * Private method to store changed to-do list to local storage.
   * @param {object} toDoListChanged - The changed to-do list to store.
   */
  #store(toDoListChanged) {
    this.toDoLists = this.toDoLists.map(toDoList => {
      if (toDoList.id === this.toDoListId) {
        const toDoListDateLastUpdated = new Date();
        toDoList.lastUpdated = toDoListDateLastUpdated.toJSON();
        toDoList.items = toDoListChanged.items;
      }
      return toDoList;
    });
    localStorage.setItem('toDoLists', JSON.stringify(this.toDoLists));
  }
  /**
   * Private method to update the view.
   * @param {object} toDoList - The to-do list to display.
   */
  #updateView(toDoList) {
    this.onToDoListChanged(toDoList);
  }
  /**
   * Method to create a new to-do list item.
   * @param {string} toDoListItemText - The new to-do list item's text.
   */
  createToDoListItem(toDoListItemText) {
    const toDoListItemDateCreated = new Date();
    const toDoListItem = {
      // Use the number of milliseconds since the ECMAScript epoch until the to-do list item's creation as the to-do list item's ID.
      // As this number is unique (with a probability bordering on certainty) there is no need to determine the last assigned to-do list item's ID in order to increment it.
      id: toDoListItemDateCreated.getTime(),
      created: toDoListItemDateCreated.toJSON(),
      lastUpdated: null,
      text: toDoListItemText,
      done: false
    };
    this.toDoList.items.push(toDoListItem);
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
  /**
   * Method to update a to-do list item.
   * @param {number} id - The to-do list item's ID.
   * @param {string} toDoListItemTextNew - The new to-do list item's text.
   */
  updateToDoListItem(id, toDoListItemTextNew) {
    this.toDoList.items = this.toDoList.items.map(toDoListItem => {
      if (toDoListItem.id === id) {
        const toDoListItemDateLastUpdated = new Date();
        toDoListItem.lastUpdated = toDoListItemDateLastUpdated.toJSON();
        toDoListItem.text = toDoListItemTextNew;
      }
      return toDoListItem;
    });
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
  /**
   * Method to delete a to-do list item.
   * @param {number} id - The to-do list item's ID.
   */
  deleteToDoListItem(id) {
    this.toDoList.items = this.toDoList.items.filter(toDoListItem => {
      return toDoListItem.id !== id;
    });
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
  /**
   * Method to toggle a to-do list item.
   * @param {number} id - The to-do list item's ID.
   */
  toggleToDoListItem(id) {
    this.toDoList.items = this.toDoList.items.map(toDoListItem => {
      if (toDoListItem.id === id) {
        toDoListItem.done = !toDoListItem.done;
      }
      return toDoListItem;
    });
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
  /**
   * Method to toggle all to-do list items.
   */
  toggleAllToDoListItems() {
    this.toDoList.items = this.toDoList.items.map(toDoListItem => {
      toDoListItem.done = !toDoListItem.done;
      return toDoListItem;
    });
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
  /**
   * Method to clear (delete all done) to-do list (items).
   */
  clearToDoList() {
    this.toDoList.items = this.toDoList.items.filter(toDoListItem => {
      return toDoListItem.done === false;
    });
    this.#store(this.toDoList);
    this.#updateView(this.toDoList);
  }
}

/**
 * Class representing a visual representation of the to-do list's dynamic data structure.
 */
class VanillaToDoListView {
  /**
   * Create a visual representation of the to-do list.
   */
  constructor() {
    this.short = 250;
    this.long = 2 * this.short;
    this.style = `
      :host {
        --cyan: rgba(0, 157, 224, 1.0);
        --cyan-three-quarter-transparent: rgba(0, 157, 224, 0.25);
        --gray: rgba(128, 128, 128, 1.0);
        --gray-semi-transparent: rgba(128, 128, 128, 0.5);
        --short: ${this.short}ms;
        --long: ${this.long}ms;
        font-family: 'Montserrat', sans-serif;
        text-align: center;
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
        background: url('/img/javascript.svg') no-repeat;
      }
      header h2 {
        margin: 0;
      }
      header h2.done {
        display: inline-block;
        background: linear-gradient(to right, transparent 0, currentcolor 0) no-repeat right center / 100% 0.1em;
        color: var(--gray);
      }
      header button#toggle-all {
        all: unset;
        position: relative;
        top: 1.75em;
        justify-content: space-around;
        display: flex;
        opacity: 1;
        transition: opacity var(--short) ease-in-out var(--short), transform var(--short) ease-in-out var(--short);
        margin: 0 0 0 0.5em;
        width: 1em;
        height: 1em;
        cursor: pointer;
      }
      header button#toggle-all::before,
      header button#toggle-all::after {
        content: '';
        position: absolute;
        border-radius: 0.1em;
        width: 0.2em;
        height: 1em;
        background: var(--cyan);
      }
      header button#toggle-all::before {
        transform: translate(20%) rotate(-45deg);
        transform-origin: bottom right;
      }
      header button#toggle-all::after {
        transform: translate(-20%) rotate(45deg);
        transform-origin: bottom left;
      }
      header button#toggle-all.hide {
        opacity: 0;
        transform: rotate(-90deg);
      }
      input[type=text] {
        position: relative;
        transition: margin var(--short) ease-in-out var(--short), width var(--short) ease-in-out var(--short);
        border: 0.15em solid var(--cyan-three-quarter-transparent);
        border-radius: 0.5em;
        box-sizing: border-box;
        width: 100%;
        padding: 0.5em;
        font-size: 1em;
        font-family: inherit;
        outline: none;
      }
      input[type=text]:focus {
        border-color: var(--cyan);
      }
      header input[type=text].shrink {
        margin: 0 0 0 10%;
        width: 90%;
      }
      section.to-do-list ul.to-do-list {
        padding: 0;
        text-align: start;
        list-style: none;
      }
      section.to-do-list ul.to-do-list li {
        position: relative;
        transition: opacity var(--long) ease-in-out, outline-color var(--short) ease-in-out;
        padding: 0.5em;
        outline: transparent dashed 0.1em;
        border-radius: 0.5em;
      }
      section.to-do-list ul.to-do-list li:hover {
        outline: var(--gray-semi-transparent) dashed 0.1em;
      }
      section.to-do-list ul.to-do-list li input[type=checkbox].select {
        appearance: none;
        position: relative;
        bottom: 0.1em;
        transition: background var(--long) ease-in-out, border var(--long) ease-in-out;
        margin: 0 0.5em 0 0;
        cursor: pointer;
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
      section.to-do-list ul.to-do-list li.hide {
        opacity: 0;
      }
      section.to-do-list ul.to-do-list li label.text {
        --strikethrough: 0;
        transition: background-size var(--long) ease-in-out, color var(--long) ease-in-out;
        background: linear-gradient(to right, transparent 0, currentcolor 0) no-repeat right center / calc(var(--strikethrough) * 100%) 0.1em;
        background-position-x: left;
        cursor: text;
        word-break: break-all;
      }
      section.to-do-list ul.to-do-list li.done label.text {
        --strikethrough: 1;
        color: var(--gray);
      }
      section.to-do-list ul.to-do-list li button.delete {
        all: unset;
        position: absolute;
        bottom: 0.6em;
        right: 0;
        justify-content: space-around;
        display: flex;
        opacity: 0;
        transition: opacity var(--short) ease-in-out;
        margin: 0 0.5em 0 0;
        width: 1em;
        height: 1em;
        cursor: pointer;
      }
      section.to-do-list ul.to-do-list li button.delete::before,
      section.to-do-list ul.to-do-list li button.delete::after {
        content: '';
        position: absolute;
        border-radius: 0.1em;
        width: 0.2em;
        height: 1em;
        background: var(--cyan);
      }
      section.to-do-list ul.to-do-list li button.delete::before {
        transform: rotate(45deg);
      }
      section.to-do-list ul.to-do-list li button.delete::after {
        transform: rotate(-45deg);
      }
      section.to-do-list ul.to-do-list li:hover button.delete {
        opacity: 1;
      }
      section.to-do-list ul.to-do-list li input[type=text] {
        width: calc(100% - 1.5em);
      }
      footer {
        margin: 1em 0 3em 0;
      }
      footer span#count {
        position: relative;
        float: left;
        opacity: 1;
        transition: opacity var(--long) ease-in-out;
        padding: 0;
        color: var(--gray);
      }
      footer span#count.hide {
        opacity: 0;
      }
      footer ul.filters {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      footer ul.filters li {
        display: inline;
      }
      footer ul.filters li a:hover {
        outline: var(--gray-semi-transparent) solid 0.1em;
        border-radius: 0.25em;
      }
      footer a {
        padding: 0.1em 0.2em;
        cursor: pointer;
        text-decoration: none;
        color: var(--cyan);
      }
      footer a.selected {
        outline: var(--gray) solid 0.1em;
        border-radius: 0.25em;
      }
      footer button#clear,
      footer button#yes,
      footer button#no {
        all: unset;
        cursor: pointer;
        color: var(--cyan);
      }
      footer button#clear,
      footer span#confirmation {
        position: relative;
        float: right;
        opacity: 1;
        transition: opacity var(--long) ease-in-out;
        padding: 0;
      }
      footer button#clear:hover,
      footer button#yes:hover,
      footer button#no:hover {
        text-decoration: underline;
        text-decoration-color: var(--gray-semi-transparent);
      }
      footer button#clear.hide {
        opacity: 0;
      }
      footer button#clear.hidden {
        display: none;
      }
    `;
    this.template = `
      <header>
        <h1>t<span id="first-o">o</span>-d<span id="second-o">o</span> list</h1>
        <h2 class="hidden"></h2>
        <button id="toggle-all" class="hide" title="Click to toggle all"></button>
        <input type="text" placeholder="What do you have to do?">
      </header>
      <section class="to-do-list"></section>
      <hr class="hidden">
      <footer class="hidden">
        <span id="count" class="hide hidden"></span>
        <ul class="filters">
          <li><a id="all" class="selected" href="#all">All</a></li>
          <li><a id="pending" href="#pending">Pending</a></li>
          <li><a id="done" href="#done">Done</a></li>
        </ul>
        <button id="clear" class="hide hidden" title="Click to delete done">Clear</button>
        <span id="confirmation" class="hidden">
          Sure?
          <button id="yes" title="Click to confirm">Yes</button>
          <button id="no" title="Click to reject">No</button>
        </span>
      </footer>
    `;
    this.nodeStyle = this.#createElement('style');
    this.nodeStyle.innerHTML = this.style;
    this.nodeSectionContainer = this.#createElement('section', 'container');
    this.nodeSectionContainer.innerHTML = this.template;
    this.nodeToggleAllToDoListItems = this.nodeSectionContainer.querySelector('button#toggle-all');
    this.nodeInputCreateToDoListItem = this.nodeSectionContainer.querySelector('header input');
    this.nodeClearToDoList = this.nodeSectionContainer.querySelector('footer button#clear');
    this.nodeConfirmation = this.nodeSectionContainer.querySelector('footer span#confirmation');
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
   * Method to render the to-do list.
   * @param {object} toDoList - The to-do list to render.
   */
  render(toDoList) {
    let toDoListItems = toDoList.items;
    const windowLocationHash = window.location.hash === '' ? '#all' : window.location.hash;
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
      if (windowLocationHash === '#pending') {
        toDoListItems = toDoListItemsPending;
      } else if (windowLocationHash === '#done') {
        toDoListItems = toDoListItemsDone;
      }
      this.nodeToggleAllToDoListItems.classList.remove('hide');
      this.nodeInputCreateToDoListItem.classList.add('shrink');
      const nodeToDoList = this.#createElement('ul', 'to-do-list');
      nodeSectionToDoList.append(nodeToDoList);
      toDoListItems.forEach(toDoListItem => {
        const listItemClass = toDoListItem.done === false ? 'pending' : 'done';
        const nodeListItem = this.#createElement('li', listItemClass);
        nodeListItem.id = toDoListItem.id;
        const nodeListItemSelect = this.#createElement('input', 'select');
        nodeListItemSelect.type = 'checkbox';
        nodeListItemSelect.title = `Click to mark as ${toDoListItem.done === false ? 'done' : 'pending'}`;
        nodeListItemSelect.checked = toDoListItem.done;
        const nodeListItemText = this.#createElement('label', 'text');
        nodeListItemText.dataset.created = toDoListItem.created;
        if (toDoListItem.lastUpdated !== null) {
          nodeListItemText.dataset.lastModified = toDoListItem.lastUpdated;
        }
        nodeListItemText.textContent = toDoListItem.text;
        nodeListItemText.title = 'Click to edit';
        const nodeListItemDelete = this.#createElement('button', 'delete');
        nodeListItemDelete.title = 'Click to delete';
        nodeListItem.append(nodeListItemSelect, nodeListItemText, nodeListItemDelete);
        nodeToDoList.append(nodeListItem);
      });
      nodeHorizontalRule.classList.remove('hidden');
      nodeFooter.classList.remove('hidden');
      nodeCountToDoListItems.textContent = `${countToDoListItemsAll} (${countToDoListItemsPending}/${countToDoListItemsDone})`;
      nodeCountToDoListItems.classList.remove('hide', 'hidden');
      if (countToDoListItemsDone > 0) {
        this.nodeClearToDoList.classList.remove('hide', 'hidden');
      } else {
        this.nodeClearToDoList.classList.add('hide', 'hidden');
      }
      this.nodeConfirmation.classList.add('hidden');
    } else {
      this.nodeToggleAllToDoListItems.classList.add('hide');
      this.nodeInputCreateToDoListItem.classList.remove('shrink');
      if (toDoList.id !== undefined) {
        const nodeNothingToDo = this.#createElement('p');
        nodeNothingToDo.textContent = 'Good for you: There\'s nothing to do!';
        nodeSectionToDoList.append(nodeNothingToDo);
      } else {
        const nodeInvalidId = this.#createElement('p');
        nodeInvalidId.textContent = 'Invalid ID! Your entries won\'t be stored!';
        nodeSectionToDoList.append(nodeInvalidId);
      }
      nodeHorizontalRule.classList.add('hidden');
      nodeFooter.classList.add('hidden');
    }
    this.nodeSectionContainer.querySelectorAll('footer ul.filters li a').forEach(nodeFilterLink => {
      nodeFilterLink.classList.remove('selected');
    });
    this.nodeSectionContainer.querySelector(windowLocationHash).classList.add('selected');
    this.nodeInputCreateToDoListItem.focus();
  }
  /**
   * Method to bind an event handler to add a new to-do list item.
   * @param {function} eventHandler - A function to handle the event.
   */
  bindCreateToDoListItem(eventHandler) {
    this.nodeInputCreateToDoListItem.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        // Only accept input that isn't all whitespace.
        if (!event.target.value.match(/^\s*$/)) {
          eventHandler(event.target.value);
          this.nodeInputCreateToDoListItem.value = '';
        }
      }
    });
  }
  /**
   * Method to bind event handlers to update to-do list items.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindUpdateToDoListItem(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('label.text').forEach(nodeToDoListItemText => {
      nodeToDoListItemText.addEventListener('click', () => {
        const nodeInputUpdateToDoListItem = this.#createElement('input');
        nodeInputUpdateToDoListItem.type = 'text';
        nodeInputUpdateToDoListItem.value = nodeToDoListItemText.textContent;
        nodeToDoListItemText.parentNode.appendChild(nodeInputUpdateToDoListItem);
        nodeToDoListItemText.classList.add('hidden');
        nodeInputUpdateToDoListItem.focus();
        nodeInputUpdateToDoListItem.addEventListener('blur', event => {
          // Only accept input that isn't all whitespace.
          if (!event.target.value.match(/^\s*$/)) {
            if (event.target.value !== nodeToDoListItemText.textContent) {
              eventHandler(+nodeToDoListItemText.parentNode.id, nodeInputUpdateToDoListItem.value);
            } else {
              nodeInputUpdateToDoListItem.remove();
              nodeToDoListItemText.classList.remove('hidden');
            }
          }
        });
        nodeInputUpdateToDoListItem.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            // Only accept input that isn't all whitespace.
            if (!event.target.value.match(/^\s*$/)) {
              if (event.target.value !== nodeToDoListItemText.textContent) {
                eventHandler(+nodeToDoListItemText.parentNode.id, nodeInputUpdateToDoListItem.value);
              } else {
                nodeInputUpdateToDoListItem.remove();
                nodeToDoListItemText.classList.remove('hidden');
              }
            }
          } else if (event.key === 'Escape') {
            nodeInputUpdateToDoListItem.remove();
            nodeToDoListItemText.classList.remove('hidden');
          }
        });
      });
    });
  }
  /**
   * Method to bind event handlers to delete to-do list items.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindDeleteToDoListItem(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('button.delete').forEach(nodeToDoListItemDelete => {
      nodeToDoListItemDelete.addEventListener('click', () => {
        eventHandler(+nodeToDoListItemDelete.parentNode.id);
      });
    });
  }
  /**
   * Method to bind event handlers to toggle to-do list items.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindToggleToDoListItem(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('input[type=checkbox].select').forEach(nodeToDoListItemSelect => {
      nodeToDoListItemSelect.addEventListener('click', () => {
        nodeToDoListItemSelect.parentNode.classList.toggle('pending');
        nodeToDoListItemSelect.parentNode.classList.toggle('done');
        // Set a timeout to wait out the visual transition before updating the view.
        setTimeout(() => {
          eventHandler(+nodeToDoListItemSelect.parentNode.id);
        }, this.long);
      });
    });
  }
  /**
   * Method to bind an event handler to toggle all to-do list items.
   * @param {function} eventHandler - A function to handle the event.
   */
  bindToggleAllToDoListItems(eventHandler) {
    this.nodeToggleAllToDoListItems.addEventListener('click', () => {
      this.nodeSectionContainer.querySelectorAll('input[type=checkbox].select').forEach(nodeToDoListItemSelect => {
        nodeToDoListItemSelect.parentNode.classList.toggle('pending');
        nodeToDoListItemSelect.parentNode.classList.toggle('done');
      });
      // Set a timeout to wait out the visual transition before updating the view.
      setTimeout(() => {
        eventHandler();
      }, this.long);
    });
  }
  /**
   * Method to bind an event handler to clear (delete all done) to-do list (items).
   * @param {function} eventHandler - A function to handle the event.
   */
  bindClearToDoList(eventHandler) {
    this.nodeClearToDoList.addEventListener('click', () => {
      this.nodeClearToDoList.classList.add('hidden');
      this.nodeConfirmation.classList.remove('hidden');
      const nodeYes = this.nodeConfirmation.querySelector('button#yes');
      nodeYes.addEventListener('click', () => {
        this.nodeConfirmation.classList.add('hidden');
        eventHandler();
      });
      const nodeNo = this.nodeConfirmation.querySelector('button#no');
      nodeNo.addEventListener('click', () => {
        this.nodeConfirmation.classList.add('hidden');
        this.nodeClearToDoList.classList.remove('hidden');
      });
    });
  }
  /**
   * Method to bind an event handler for when the window hash changed.
   * @param {function} eventHandler - A function to handle the event.
   */
  bindWindowHashChange(eventHandler) {
    window.addEventListener('hashchange', () => {
      eventHandler();
    });
  }
}

/**
 * Class representing a link between the to-do list's dynamic data structure (model) and its visual representation (view).
 */
class VanillaToDoListController {
  /**
   * Link the model and the view.
   * @param {object} model - The to-do list's dynamic data structure.
   * @param {object} view - The visual representation of the to-do list's dynamic data structure.
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindToDoListChanged(this.onToDoListChanged);
    this.view.bindCreateToDoListItem(this.handleCreateToDoListItem);
    this.view.bindToggleAllToDoListItems(this.handleToggleAllToDoListItems);
    this.view.bindClearToDoList(this.handleClearToDoList);
    // this.view.bindWindowHashChange(this.handleWindowHashChange);
    this.onToDoListChanged(this.model.toDoList);
  }
  /**
   * Method for when the to-do list changed.
   * @param {object} toDoList - The changed to-do list.
   */
  onToDoListChanged = (toDoList) => {
    this.view.render(toDoList);
    this.view.bindUpdateToDoListItem(this.handleUpdateToDoListItem);
    this.view.bindDeleteToDoListItem(this.handleDeleteToDoListItem);
    this.view.bindToggleToDoListItem(this.handleToggleToDoListItem);
  }
  /**
   * Method to handle the create a new to-do list item event.
   */
  handleCreateToDoListItem = toDoListItemText => {
    this.model.createToDoListItem(toDoListItemText);
  };
  /**
   * Method to handle the update a to-do list item event.
   */
  handleUpdateToDoListItem = (id, toDoListItemTextNew) => {
    this.model.updateToDoListItem(id, toDoListItemTextNew);
  };
  /**
   * Method to handle the delete a to-do list item event.
   */
  handleDeleteToDoListItem = id => {
    this.model.deleteToDoListItem(id);
  };
  /**
   * Method to handle the toggle a to-do list item event.
   */
  handleToggleToDoListItem = id => {
    this.model.toggleToDoListItem(id);
  };
  /**
   * Method to handle the toggle all to-do list items event.
   */
  handleToggleAllToDoListItems = () => {
    this.model.toggleAllToDoListItems();
  };
  /**
   * Method to handle the clear (delete all done) to-do list (items) event.
   */
  handleClearToDoList = () => {
    this.model.clearToDoList();
  };
  /**
   * Method to handle the window hash change event.
   */
  handleWindowHashChange = () => {
    this.onToDoListChanged(this.model.toDoList);
  };
}

/**
 * Class representing a custom element to insert a to-do list to the document.
 * @extends HTMLElement
 */
class VanillaToDoList extends HTMLElement {
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
    this.application = new VanillaToDoListController(new VanillaToDoListModel(this.id), new VanillaToDoListView());
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.append(this.application.view.nodeStyle, this.application.view.nodeSectionContainer);
    shadowRoot.querySelector('header input').focus();
  }
  connectedCallback() {
    // Add an event handler for when the window hash changed.
    window.addEventListener('hashchange', this.application.handleWindowHashChange);
  }
  disconnectedCallback() {
    // Remove the event handler for when the window hash changed.
    window.removeEventListener('hashchange', this.application.handleWindowHashChange);
  }
}

/**
 * Register a new custom element to eventually be able to insert a to-do list to the document.
 */
customElements.define('vanilla-to-do-list', VanillaToDoList);