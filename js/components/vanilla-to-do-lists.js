/**
 * Import subcomponent for a to-do list preview.
 */
import {VanillaToDoListPreview} from './vanilla-to-do-list-preview.js';

/**
 * Class representing the to-do lists' dynamic data structure.
 */
class VanillaToDoListsModel {
  /**
   * Retrieve a to-do lists array from local storage if available or create an empty one.
   */
  constructor() {
    this.toDoLists = JSON.parse(localStorage.getItem('toDoLists')) || [];
  }
  /**
   * Method to bind a callback for when the to-do lists changed.
   * @param {function} callback - A callback function executed when the to-do lists changed.
   */
  bindToDoListsChanged(callback) {
    this.onToDoListsChanged = callback;
  }
  /**
   * Private method to store to-do lists to local storage.
   * @param {object} toDoLists - The to-do lists to store.
   */
  #store(toDoLists) {
    localStorage.setItem('toDoLists', JSON.stringify(toDoLists));
  }
  /**
   * Private method to update the view.
   * @param {object} toDoLists - The to-do lists to display.
   */
  #updateView(toDoLists) {
    this.onToDoListsChanged(toDoLists);
  }
  /**
   * Method to create a new to-do list.
   * @param {string} toDoListName - The new to-do list's name.
   */
  createToDoList(toDoListName) {
    const toDoListDateCreated = new Date();
    const toDoList = {
      // Use the number of milliseconds since the ECMAScript epoch until the to-do list's creation as the to-do list's ID.
      // As this number is unique (with a probability bordering on certainty) there is no need to determine the last assigned to-do list's ID in order to increment it.
      id: toDoListDateCreated.getTime(),
      created: toDoListDateCreated.toJSON(),
      lastRenamed: null,
      lastUpdated: null,
      name: toDoListName,
      done: false,
      items: []
    };
    this.toDoLists.push(toDoList);
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
  /**
   * Method to update a to-do list.
   * @param {number} id - The to-do list's ID.
   * @param {string} toDoListNameNew - The new to-do list's name.
   */
  updateToDoList(id, toDoListNameNew) {
    this.toDoLists = this.toDoLists.map(toDoList => {
      if (toDoList.id === id) {
        const toDoListDateLastRenamed = new Date();
        toDoList.lastRenamed = toDoListDateLastRenamed.toJSON();
        toDoList.name = toDoListNameNew;
      }
      return toDoList;
    });
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
  /**
   * Method to delete a to-do list.
   * @param {number} id - The to-do list's ID.
   */
  deleteToDoList(id) {
    this.toDoLists = this.toDoLists.filter(toDoList => {
      return toDoList.id !== id;
    });
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
  /**
   * Method to toggle a to-do list.
   * @param {number} id - The to-do list's ID.
   */
  toggleToDoList(id) {
    this.toDoLists = this.toDoLists.map(toDoList => {
      if (toDoList.id === id) {
        toDoList.done = !toDoList.done;
      }
      return toDoList;
    });
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
  /**
   * Method to toggle all to-do lists.
   */
  toggleAllToDoLists() {
    this.toDoLists = this.toDoLists.map(toDoList => {
      toDoList.done = !toDoList.done;
      return toDoList;
    });
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
  /**
   * Method to clear (delete all done) to-do lists (to-do lists).
   */
  clearToDoLists() {
    this.toDoLists = this.toDoLists.filter(toDoList => {
      return toDoList.done === false;
    });
    this.#store(this.toDoLists);
    this.#updateView(this.toDoLists);
  }
}

/**
 * Class representing a visual representation of the to-do lists' dynamic data structure.
 */
class VanillaToDoListsView {
  /**
   * Create a visual representation of the to-do lists.
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
        background: url('/vanilla-to-do-list/img/javascript.svg') no-repeat;
      }
      header h2 {
        margin: 0;
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
      section.to-do-lists ul.to-do-lists {
        padding: 0;
        text-align: start;
        list-style: none;
      }
      section.to-do-lists ul.to-do-lists li {
        position: relative;
        transition: opacity var(--long) ease-in-out, outline-color var(--short) ease-in-out;
        padding: 0.5em;
        outline: transparent dashed 0.1em;
        border-radius: 0.5em;
      }
      section.to-do-lists ul.to-do-lists li:hover {
        outline: var(--gray-semi-transparent) dashed 0.1em;
      }
      section.to-do-lists ul.to-do-lists li input[type=checkbox].select {
        appearance: none;
        position: relative;
        bottom: 0.1em;
        transition: background var(--long) ease-in-out, border var(--long) ease-in-out;
        margin: 0 0.5em 0 0;
        cursor: pointer;
        font-size: inherit;
        vertical-align: middle;
      }
      section.to-do-lists ul.to-do-lists li.pending input[type=checkbox].select,
      section.to-do-lists ul.to-do-lists li.done input[type=checkbox].select {
        display: inline-block;
        border-radius: 50%;
        box-sizing: border-box;
        width: 1em;
        height: 1em;
      }
      section.to-do-lists ul.to-do-lists li.pending input[type=checkbox].select {
        border: 0.2em solid var(--cyan);
        background: transparent;
      }
      section.to-do-lists ul.to-do-lists li.done input[type=checkbox].select {
        border: 0.5em solid var(--cyan);
        background: var(--cyan);
      }
      section.to-do-lists ul.to-do-lists li.hide {
        opacity: 0;
      }
      section.to-do-lists ul.to-do-lists li label.name {
        --strikethrough: 0;
        transition: background-size var(--long) ease-in-out, color var(--long) ease-in-out;
        background: linear-gradient(to right, transparent 0, currentcolor 0) no-repeat right center / calc(var(--strikethrough) * 100%) 0.1em;
        background-position-x: left;
        cursor: text;
        word-break: break-all;
      }
      section.to-do-lists ul.to-do-lists li label.name a {
        text-decoration: none;
        color: var(--cyan);
      }
      section.to-do-lists ul.to-do-lists li.done label.name {
        --strikethrough: 1;
        color: var(--gray);
      }
      section.to-do-lists ul.to-do-lists li button.edit {
        all: unset;
        position: absolute;
        bottom: 0.6em;
        right: 1.5em;
        justify-content: space-around;
        display: flex;
        opacity: 0;
        transform: rotate(45deg);
        transition: opacity var(--short) ease-in-out;
        margin: 0 0.5em 0 0;
        width: 1em;
        height: 1em;
        cursor: pointer;
      }
      section.to-do-lists ul.to-do-lists li button.edit::before,
      section.to-do-lists ul.to-do-lists li button.edit::after {
        content: '';
        position: absolute;
        border-radius: 0.05em;
        width: 0.25em;
      }
      section.to-do-lists ul.to-do-lists li button.edit::before {
        height: 0.7em;
        background: var(--cyan);
      }
      section.to-do-lists ul.to-do-lists li button.edit::after {
        bottom: 0;
        width: 0;
        height: 0;
        border-left: 0.125em solid transparent;
        border-right: 0.125em solid transparent;
        border-top: 0.25em solid var(--cyan);
      }
      section.to-do-lists ul.to-do-lists li:hover button.edit {
        opacity: 1;
      }
      section.to-do-lists ul.to-do-lists li button.delete {
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
      section.to-do-lists ul.to-do-lists li button.delete::before,
      section.to-do-lists ul.to-do-lists li button.delete::after {
        content: '';
        position: absolute;
        border-radius: 0.1em;
        width: 0.2em;
        height: 1em;
        background: var(--cyan);
      }
      section.to-do-lists ul.to-do-lists li button.delete::before {
        transform: rotate(45deg);
      }
      section.to-do-lists ul.to-do-lists li button.delete::after {
        transform: rotate(-45deg);
      }
      section.to-do-lists ul.to-do-lists li:hover button.delete {
        opacity: 1;
      }
      section.to-do-lists ul.to-do-lists li input[type=text] {
        width: calc(100% - 1.5em);
      }
      section.to-do-lists ul.to-do-lists li label.name section.tooltip {
        position: relative;
        z-index: 1;
        display: none;
        border: 0.15em solid var(--cyan);
        border-radius: 0.5em;
        box-sizing: border-box;
        width: 22.5vw;
        padding: 0 1em;
        min-width: 22.5em;
        background: white;
      }
      section.to-do-lists ul.to-do-lists li label.name a:hover ~ section.tooltip {
        position: fixed;
        display: block;
        overflow: hidden;
      }
      section.to-do-lists ul.to-do-lists li.done label.name section.tooltip vanilla-to-do-list-preview {
        opacity: 50%;
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
        <h1>t<span id="first-o">o</span>-d<span id="second-o">o</span> lists</h1>
        <h2>Overview of your to-do lists</h2>
        <button id="toggle-all" class="hide" title="Click to toggle all"></button>
        <input type="text" placeholder="What should the new to-do list be called?">
      </header>
      <section class="to-do-lists"></section>
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
    this.nodeToggleAllToDoLists = this.nodeSectionContainer.querySelector('button#toggle-all');
    this.nodeInputCreateToDoList = this.nodeSectionContainer.querySelector('header input');
    this.nodeClearToDoLists = this.nodeSectionContainer.querySelector('footer button#clear');
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
   * Method to render the to-do lists.
   * @param {object} toDoLists - The to-do lists to render.
   */
  render(toDoLists) {
    const windowLocationHash = window.location.hash === '' ? '#all' : window.location.hash;
    const nodeToDoListsSection = this.nodeSectionContainer.querySelector('section.to-do-lists');
    // First, remove any existing child nodes respectively the paragraph or the to-do list.
    nodeToDoListsSection.replaceChildren();
    const nodeHorizontalRule = this.nodeSectionContainer.querySelector('hr');
    const nodeFooter = this.nodeSectionContainer.querySelector('footer');
    const nodeCountToDoLists = this.nodeSectionContainer.querySelector('footer span#count');
    if (toDoLists.length > 0) {
      const toDoListsPending = toDoLists.filter(toDoList => {
        return toDoList.done !== true;
      });
      const toDoListsDone = toDoLists.filter(toDoList => {
        return toDoList.done !== false;
      });
      const countToDoListsAll = toDoLists.length;
      const countToDoListsPending = toDoListsPending.length;
      const countToDoListsDone = toDoListsDone.length;
      if (windowLocationHash === '#pending') {
        toDoLists = toDoListsPending;
      } else if (windowLocationHash === '#done') {
        toDoLists = toDoListsDone;
      }
      this.nodeToggleAllToDoLists.classList.remove('hide');
      this.nodeInputCreateToDoList.classList.add('shrink');
      const nodeToDoLists = this.#createElement('ul', 'to-do-lists');
      nodeToDoListsSection.append(nodeToDoLists);
      toDoLists.forEach(toDoList => {
        const toDoListItems = toDoList.items;
        const toDoListItemsPending = toDoListItems.filter(toDoListItem => {
          return toDoListItem.done !== true;
        });
        const toDoListItemsDone = toDoListItems.filter(toDoListItem => {
          return toDoListItem.done !== false;
        });
        const countToDoListItemsAll = toDoListItems.length;
        const countToDoListItemsPending = toDoListItemsPending.length;
        const countToDoListItemsDone = toDoListItemsDone.length;
        const listItemClass = toDoList.done === false ? 'pending' : 'done';
        const nodeListItem = this.#createElement('li', listItemClass);
        nodeListItem.id = toDoList.id;
        const nodeListItemSelect = this.#createElement('input', 'select');
        nodeListItemSelect.type = 'checkbox';
        nodeListItemSelect.title = `Click to mark as ${toDoList.done === false ? 'done' : 'pending'}`;
        nodeListItemSelect.checked = toDoList.done;
        const nodeListItemName = this.#createElement('label', 'name');
        nodeListItemName.dataset.created = toDoList.created;
        if (toDoList.lastRenamed !== null) {
          nodeListItemName.dataset.lastRenamed = toDoList.lastRenamed;
        }
        if (toDoList.lastUpdated !== null) {
          nodeListItemName.dataset.lastModified = toDoList.lastUpdated;
        }
        const nodeListItemNameLink = this.#createElement('a');
        nodeListItemNameLink.href = `/to-do-list/${toDoList.id}`;
        nodeListItemNameLink.textContent = toDoList.name;
        const nodeListItemCount = this.#createElement('span', 'count');
        nodeListItemCount.textContent = `(${countToDoListItemsAll} ${countToDoListItemsAll === 1 ? 'item' : 'items'}${countToDoListItemsAll > 0 ? ': ' + countToDoListItemsPending + ' pending, ' + countToDoListItemsDone + ' done' : ''})`;
        const tooltipSectionContainer = this.#createElement('section', 'tooltip');
        // Using the innerHTML property along with a template string rather than creating and appending the respective custom element
        // to make the ID attribute present in the first place and therefore avoiding the need of an attribute changed callback.
        tooltipSectionContainer.innerHTML = `<vanilla-to-do-list-preview id="${toDoList.id}"></vanilla-to-do-list-preview>`;
        nodeListItemName.append(nodeListItemNameLink, '\u00A0', nodeListItemCount, tooltipSectionContainer);
        const nodeListItemEdit = this.#createElement('button', 'edit');
        nodeListItemEdit.title = 'Click to edit';
        const nodeListItemDelete = this.#createElement('button', 'delete');
        nodeListItemDelete.title = 'Click to delete';
        nodeListItem.append(nodeListItemSelect, nodeListItemName, nodeListItemEdit, nodeListItemDelete);
        nodeToDoLists.append(nodeListItem);
      });
      nodeHorizontalRule.classList.remove('hidden');
      nodeFooter.classList.remove('hidden');
      nodeCountToDoLists.textContent = `${countToDoListsAll} (${countToDoListsPending}/${countToDoListsDone})`;
      nodeCountToDoLists.classList.remove('hide', 'hidden');
      if (countToDoListsDone > 0) {
        this.nodeClearToDoLists.classList.remove('hide', 'hidden');
      } else {
        this.nodeClearToDoLists.classList.add('hide', 'hidden');
      }
      this.nodeConfirmation.classList.add('hidden');
    } else {
      this.nodeToggleAllToDoLists.classList.add('hide');
      this.nodeInputCreateToDoList.classList.remove('shrink');
      const nodeNothingToDo = this.#createElement('p');
      nodeNothingToDo.textContent = 'There are no to-do lists to show!';
      nodeToDoListsSection.append(nodeNothingToDo);
      nodeHorizontalRule.classList.add('hidden');
      nodeFooter.classList.add('hidden');
    }
    this.nodeSectionContainer.querySelectorAll('footer ul.filters li a').forEach(nodeFilterLink => {
      nodeFilterLink.classList.remove('selected');
    });
    this.nodeSectionContainer.querySelector(windowLocationHash).classList.add('selected');
    this.nodeInputCreateToDoList.focus();
  }
  /**
   * Method to bind an event handler to add a new to-do list.
   * @param {function} eventHandler - A function to handle the event.
   */
  bindCreateToDoList(eventHandler) {
    this.nodeInputCreateToDoList.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        // Only accept input that isn't all whitespace.
        if (!event.target.value.match(/^\s*$/)) {
          eventHandler(event.target.value);
          this.nodeInputCreateToDoList.value = '';
        }
      }
    });
  }
  /**
   * Method to bind event handlers to update to-do lists.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindUpdateToDoList(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('button.edit').forEach(nodeEditToDoList => {
      nodeEditToDoList.addEventListener('click', () => {
        const toDoListName = nodeEditToDoList.parentNode.querySelector('label.name a').textContent;
        const nodeInputUpdateToDoList = this.#createElement('input');
        nodeInputUpdateToDoList.type = 'text';
        nodeInputUpdateToDoList.value = toDoListName;
        nodeEditToDoList.parentNode.appendChild(nodeInputUpdateToDoList);
        nodeEditToDoList.parentNode.querySelector('label.name').classList.add('hidden');
        nodeInputUpdateToDoList.focus();
        nodeInputUpdateToDoList.addEventListener('blur', event => {
          // Only accept input that isn't all whitespace.
          if (!event.target.value.match(/^\s*$/)) {
            if (event.target.value !== toDoListName) {
              eventHandler(+nodeEditToDoList.parentNode.id, nodeInputUpdateToDoList.value);
            } else {
              nodeInputUpdateToDoList.remove();
              nodeEditToDoList.parentNode.querySelector('label.name').classList.remove('hidden');
            }
          }
        });
        nodeInputUpdateToDoList.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            // Only accept input that isn't all whitespace.
            if (!event.target.value.match(/^\s*$/)) {
              if (event.target.value !== toDoListName) {
                eventHandler(+nodeEditToDoList.parentNode.id, nodeInputUpdateToDoList.value);
              } else {
                nodeInputUpdateToDoList.remove();
                nodeEditToDoList.parentNode.querySelector('label.name').classList.remove('hidden');
              }
            }
          } else if (event.key === 'Escape') {
            nodeInputUpdateToDoList.remove();
            nodeEditToDoList.parentNode.querySelector('label.name').classList.remove('hidden');
          }
        });
      });
    });
  }
  /**
   * Method to bind event handlers to delete to-do lists.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindDeleteToDoList(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('button.delete').forEach(nodeDeleteToDoList => {
      nodeDeleteToDoList.addEventListener('click', () => {
        eventHandler(+nodeDeleteToDoList.parentNode.id);
      });
    });
  }
  /**
   * Method to bind event handlers to toggle to-do lists.
   * @param {function} eventHandler - A function to handle the events.
   */
  bindToggleToDoList(eventHandler) {
    this.nodeSectionContainer.querySelectorAll('input[type=checkbox].select').forEach(nodeSelectToDoList => {
      nodeSelectToDoList.addEventListener('click', () => {
        nodeSelectToDoList.parentNode.classList.toggle('pending');
        nodeSelectToDoList.parentNode.classList.toggle('done');
        // Set a timeout to wait out the visual transition before updating the view.
        setTimeout(() => {
          eventHandler(+nodeSelectToDoList.parentNode.id);
        }, this.long);
      });
    });
  }
  /**
   * Method to bind an event handler to toggle all to-do lists.
   * @param {function} eventHandler - A function to handle the event.
   */
  bindToggleAllToDoLists(eventHandler) {
    this.nodeToggleAllToDoLists.addEventListener('click', () => {
      this.nodeSectionContainer.querySelectorAll('input[type=checkbox].select').forEach(nodeSelectToDoList => {
        nodeSelectToDoList.parentNode.classList.toggle('pending');
        nodeSelectToDoList.parentNode.classList.toggle('done');
      });
      // Set a timeout to wait out the visual transition before updating the view.
      setTimeout(() => {
        eventHandler();
      }, this.long);
    });
  }
  /**
   * Method to bind an event handler to clear (delete all done) to-do lists (to-do lists).
   * @param {function} eventHandler - A function to handle the event.
   */
  bindClearToDoLists(eventHandler) {
    this.nodeClearToDoLists.addEventListener('click', () => {
      this.nodeClearToDoLists.classList.add('hidden');
      this.nodeConfirmation.classList.remove('hidden');
      const nodeYes = this.nodeConfirmation.querySelector('button#yes');
      nodeYes.addEventListener('click', () => {
        this.nodeConfirmation.classList.add('hidden');
        eventHandler();
      });
      const nodeNo = this.nodeConfirmation.querySelector('button#no');
      nodeNo.addEventListener('click', () => {
        this.nodeConfirmation.classList.add('hidden');
        this.nodeClearToDoLists.classList.remove('hidden');
      });
    });
  }
  /**
   * Method to bind event handlers to route to-do lists.
   */
  bindRouteToDoList() {
    this.nodeSectionContainer.querySelectorAll('label.name a').forEach(nodeLinkToDoList => {
      nodeLinkToDoList.addEventListener('click', event => {
        // Prevent a page reload.
        event.preventDefault();
        // Assign the hyperlink's target URL to a pathname object.
        const {pathname: path} = new URL(event.target.href);
        // Add a new entry to the browser's session history stack.
        window.history.pushState({path}, '', path);
        // Assign a new popstate event including the previously assigned pathname object and trigger it manually.
        const popStateEvent = new PopStateEvent('popstate', {pathname: path});
        dispatchEvent(popStateEvent);
      });
    });
  }
  /**
   * Method to handle the window mouse move event for when the to-do lists' links are hovered.
   */
  handleWindowMouseMove = (event) => {
    const previewTooltips = this.nodeSectionContainer.querySelectorAll('section.tooltip');
    previewTooltips.forEach(previewTooltip => {
      previewTooltip.style.top = (window.innerHeight - event.clientY < previewTooltip.offsetHeight ? event.clientY - previewTooltip.offsetHeight : event.clientY) + 'px';
      previewTooltip.style.left = event.clientX + 'px';
    });
  };
}

/**
 * Class representing a link between the to-do lists' dynamic data structure (model) and its visual representation (view).
 */
class VanillaToDoListsController {
  /**
   * Link the model and the view.
   * @param {object} model - The to-do lists' dynamic data structure.
   * @param {object} view - The visual representation of the to-do lists' dynamic data structure.
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindToDoListsChanged(this.onToDoListsChanged);
    this.view.bindCreateToDoList(this.handleCreateToDoList);
    this.view.bindToggleAllToDoLists(this.handleToggleAllToDoLists);
    this.view.bindClearToDoLists(this.handleClearToDoLists);
    this.onToDoListsChanged(this.model.toDoLists);
  }
  /**
   * Method for when the to-do lists changed.
   * @param {object} toDoList - The changed to-do lists.
   */
  onToDoListsChanged = toDoLists => {
    this.view.render(toDoLists);
    this.view.bindUpdateToDoList(this.handleUpdateToDoList);
    this.view.bindDeleteToDoList(this.handleDeleteToDoList);
    this.view.bindToggleToDoList(this.handleToggleToDoList);
    this.view.bindRouteToDoList();
  }
  /**
   * Method to handle the create a new to-do list event.
   */
  handleCreateToDoList = toDoListName => {
    this.model.createToDoList(toDoListName);
  };
  /**
   * Method to handle the update a to-do list event.
   */
  handleUpdateToDoList = (id, toDoListNameNew) => {
    this.model.updateToDoList(id, toDoListNameNew);
  };
  /**
   * Method to handle the delete a to-do list event.
   */
  handleDeleteToDoList = id => {
    this.model.deleteToDoList(id);
  };
  /**
   * Method to handle the toggle a to-do list event.
   */
  handleToggleToDoList = id => {
    this.model.toggleToDoList(id);
  };
  /**
   * Method to handle the toggle all to-do lists event.
   */
  handleToggleAllToDoLists = () => {
    this.model.toggleAllToDoLists();
  };
  /**
   * Method to handle the clear (delete all done) to-do lists (to-do lists) event.
   */
  handleClearToDoLists = () => {
    this.model.clearToDoLists();
  };
  /**
   * Method to handle the window hash change event.
   */
  handleWindowHashChange = () => {
    this.onToDoListsChanged(this.model.toDoLists);
  };
}

/**
 * Class representing a custom element to insert to-do lists to the document.
 * @extends HTMLElement
 */
class VanillaToDoLists extends HTMLElement {
  /**
   * Create the custom element and attach its visual representation to the shadow DOM.
   */
  constructor() {
    super();
    this.application = new VanillaToDoListsController(new VanillaToDoListsModel(), new VanillaToDoListsView());
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.append(this.application.view.nodeStyle, this.application.view.nodeSectionContainer);
    shadowRoot.querySelector('header input').focus();
  }
  connectedCallback() {
    // Add an event handler for when the window hash changed.
    window.addEventListener('hashchange', this.application.handleWindowHashChange);
    // Add an event handler for when the window mouse moves (and to-do lists' links are hovered).
    window.addEventListener('mousemove', this.application.view.handleWindowMouseMove);
  }
  disconnectedCallback() {
    // Remove the event handler for when the window hash changed.
    window.removeEventListener('hashchange', this.application.handleWindowHashChange);
    // Remove the event handler for when the window mouse moves (and to-do lists' links are hovered).
    window.removeEventListener('mousemove', this.application.view.handleWindowMouseMove);
  }
}

/**
 * Register a new custom element to eventually be able to insert to-do lists to the document.
 */
customElements.define('vanilla-to-do-lists', VanillaToDoLists);
