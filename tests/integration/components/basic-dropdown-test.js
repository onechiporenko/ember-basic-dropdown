import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { clickTrigger } from '../../helpers/ember-basic-dropdown';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic dropdown', {
  integration: true
});

test('Its `toggle` action opens and closes the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is again');

  // TODO: Not sure if this is relevant
  // assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
});

test('Its `open` action opens the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is still opened');
});

test('Its `close` action closes the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown initiallyOpened=true as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is still closed');
});

test('It can receive an onOpen action that is fired just before the component opens', function(assert) {
  assert.expect(4);

  this.willOpen = function(dropdown, e) {
    assert.equal(dropdown.isOpen, false, 'The received dropdown has a `isOpen` property that is still false');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onOpen action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=willOpen as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
});

test('returning false from the `onOpen` action prevents the dropdown from opening', function(assert) {
  assert.expect(2);

  this.willOpen = function() {
    assert.ok(true, 'willOpen has been called');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=willOpen as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is still closed');
});

test('It can receive an onClose action that is fired when the component closes', function(assert) {
  assert.expect(7);

  this.willClose = function(dropdown, e) {
    assert.equal(dropdown.isOpen, true, 'The received dropdown has a `isOpen` property and its value is `true`');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onClose action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onClose=willClose as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is now opened');
});

test('returning false from the `onClose` action prevents the dropdown from closing', function(assert) {
  assert.expect(4);

  this.willClose = function() {
    assert.ok(true, 'willClose has been invoked');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onClose=willClose as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is still opened');
});

test('It can be rendered already opened when the `initiallyOpened=true`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown initiallyOpened=true as |dropdown|}}
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
});

test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onOpenCalls = 0;
  this.onOpen = () => {
    onOpenCalls++;
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=onOpen as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  clickTrigger();
  clickTrigger();
  assert.equal(onOpenCalls, 1, 'onOpen has been called only once');
});

test('Calling the `close` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onCloseCalls = 0;
  this.onFocus = (dropdown) => {
    dropdown.actions.close();
  };
  this.onClose = () => {
    onCloseCalls++;
  };

  this.render(hbs`
    {{#basic-dropdown onClose=onClose as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  clickTrigger();
  clickTrigger();
  assert.equal(onCloseCalls, 0, 'onClose was never called');
});

test('It adds the proper class to trigger and content when it receives `horizontalPosition="right"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown horizontalPosition="right" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown--right'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--right'), 'The proper class has been added');
});

test('It adds the proper class to trigger and content when it receives `horizontalPosition="center"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown horizontalPosition="center" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown--center'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--center'), 'The proper class has been added');
});

test('It adds the proper class to trigger and content when it receives `verticalPosition="above"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown verticalPosition="above" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown--above'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--above'), 'The proper class has been added');
});

// test('BUGFIX: When clicking in the trigger text selection is disabled until the user raises the finger', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown onOpen=onOpen}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   run(() => {
//     let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.equal($('#ember-testing').css('user-select'), 'none', 'Text selection is disabled in the entire app');
//   run(() => {
//     let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.notEqual($('#ember-testing').css('user-select'), 'none', 'Text selection is not disabled in the entire app');
// });

// test('it adds a `ember-basic-dropdown--transitioning-out` when closing if it has transitions', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     <style>
//       .fade-dropdown-test-class {
//         transition: opacity .2s;
//         opacity: 0;
//       }
//       .fade-dropdown-test-class.ember-basic-dropdown--transitioned-in {
//         opacity: 1;
//       }
//     </style>
//     {{#basic-dropdown dropdownClass="fade-dropdown-test-class" animationEnabled=true}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is opened');
//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is still opened');
//   assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--transitioning-out'), 'It has the transitioning-out class');
// });

// test('when some element inside the trigger of a dropdown gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   run(() => this.$('button')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });

// test('when some element inside the dropdown-content when the component gets `renderedInPlace=true` gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown renderedInPlace=true}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   run(() => $('#input-inside-dropdown-content')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });

// test('when some element inside the dropdown-content when the component gets `renderedInPlace=false` gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown renderedInPlace=false}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   run(() => $('#input-inside-dropdown-content')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });