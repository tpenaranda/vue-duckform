import { integer, required, regex } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import RangeSlider from 'vue-range-slider';
import 'vue-range-slider/dist/vue-range-slider.css';
import 'vue-date-pick/dist/vueDatePick.css';
import DatePick from 'vue-date-pick';
import moment from 'moment';

//

extend('integer', Object.assign({}, integer,
  {message: 'Field must be an integer.'}));
extend('required', Object.assign({}, required,
  {message: 'Field is required.'}));

var script = {
  components: { ValidationProvider: ValidationProvider },
  props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: function () { return { possible_answers: [{}], possible_answers_selected: [] } }
      },
  },
  data: function () { return ({
    output: null,
    rules: [],
    inputText: null
  }); },
  created: function created () {
    this.output = this.value;
    if (this.value.type === 'integer') {
      this.rules.push('integer');
    }

    if (this.value.required) {
      this.rules.push('required');
    }

    if (!this.value.possible_answers_selected[0]) {
      this.output.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }];
    }

    this.inputText = this.value.possible_answers_selected[0].data;
  },
  methods: {
    handleInputChange: function handleInputChange () {
      this.output.possible_answers_selected[0].data = this.inputText;
      this.$emit('input', this.output);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("label", [
    _c(
      "div",
      { staticClass: "input" },
      [
        _c("validation-provider", {
          attrs: { rules: _vm.rules.join("|"), name: _vm.value.text },
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(slotProps) {
                return [
                  _c("div", { staticClass: "row" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.inputText,
                          expression: "inputText",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "w-100",
                      attrs: {
                        type: "text",
                        disabled: _vm.disabled,
                        id: _vm.value.possible_answers[0].id,
                        name: "A" + _vm.value.possible_answers[0].id
                      },
                      domProps: { value: _vm.inputText },
                      on: {
                        input: [
                          function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.inputText = $event.target.value.trim();
                          },
                          function($event) {
                            return _vm.handleInputChange()
                          }
                        ],
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    }),
                    _vm._v(" "),
                    _vm.value.possible_answers[0].text
                      ? _c(
                          "p",
                          {
                            staticClass: "label pl-1",
                            staticStyle: {
                              "padding-top": "2px",
                              "white-space": "nowrap"
                            }
                          },
                          [
                            _vm._v(
                              "[" +
                                _vm._s(_vm.value.possible_answers[0].text) +
                                "]"
                            )
                          ]
                        )
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "small text-danger mb-0" }, [
                    _vm._v(_vm._s(slotProps.errors.join(" ")))
                  ])
                ]
              }
            }
          ])
        })
      ],
      1
    )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

//

extend('required', Object.assign({}, required,
  {message: 'Field is required.'}));

var script$1 = {
  components: { ValidationProvider: ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function () { return { possible_answers: [], possible_answers_selected: [] } }
    },
  },
  computed: {
    rules: function rules () {
      return this.value.required ? 'required' : null
    },
    selectedAnswerId: function selectedAnswerId () {
      if (!this.value.possible_answers_selected[0]) {
        return null
      }

      return this.value.possible_answers_selected[0].id
    }
  },
  methods: {
    handleInputChange: function handleInputChange (id) {
      return this.value.possible_answers_selected = [{id: id, data: null}]
    }
  }
};

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "ul",
    { staticClass: "list-unstyled options mb-2", class: "_" + _vm.value.type },
    [
      _vm._l(_vm.value.possible_answers, function(answer, answerIndex) {
        return _c("li", { key: answer.id }, [
          _c("label", { staticClass: "row" }, [
            _c("div", { staticClass: "selector py-1" }, [
              _c("input", {
                attrs: {
                  type: "radio",
                  disabled: _vm.disabled,
                  id: "A" + answer.id,
                  name: "Q" + _vm.value.id
                },
                domProps: { checked: _vm.selectedAnswerId === answer.id },
                on: {
                  change: function($event) {
                    return _vm.handleInputChange(answer.id)
                  }
                }
              }),
              _vm._v(" "),
              _c("span", { staticClass: "radio marker" })
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "label pl-2 py-1" }, [
              _vm._v(_vm._s(answer.text))
            ])
          ])
        ])
      }),
      _vm._v(" "),
      _c("validation-provider", {
        attrs: { rules: _vm.rules, name: _vm.value.text },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var errors = ref.errors;
              return [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.selectedAnswerId,
                      expression: "selectedAnswerId"
                    }
                  ],
                  staticStyle: { display: "none" },
                  attrs: { type: "text" },
                  domProps: { value: _vm.selectedAnswerId },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.selectedAnswerId = $event.target.value;
                    }
                  }
                }),
                _vm._v(" "),
                _c("p", { staticClass: "text-danger small" }, [
                  _vm._v(_vm._s(errors.join(" ")))
                ])
              ]
            }
          }
        ])
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-24a7523b_0", { source: ".selector[data-v-24a7523b] {\n  display: inline-block;\n}\n.selector input[data-v-24a7523b] {\n  display: none;\n}\n.selector .marker[data-v-24a7523b] {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.selector input:checked ~ .marker[data-v-24a7523b] {\n  background-color: #8ec0ed;\n  border-color: #8ec0ed;\n}\n.selector label:hover .marker[data-v-24a7523b] {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Radio.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/components/Questions/Radio.vue","Radio.vue"],"names":[],"mappings":"AAoEA;EACA,qBAAA;ACnEA;ADqEA;EACA,aAAA;ACnEA;ADsEA;EACA,mBAAA;EACA,mBAXA;EAYA,2BAAA;EACA,aAAA;EACA,YAdA;EAeA,uBAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAlBA;AClDA;ADsEA;EACA,yBAAA;EACA,qBAAA;ACpEA;ADuEA;EACA,qBAAA;ACrEA;;AAEA,oCAAoC","file":"Radio.vue","sourcesContent":["<template>\n  <ul class=\"list-unstyled options mb-2\" :class=\"`_${value.type}`\">\n    <li v-for=\"(answer, answerIndex) in value.possible_answers\" :key=\"answer.id\">\n      <label class=\"row\">\n        <div class=\"selector py-1\">\n          <input type=\"radio\"\n            :disabled=\"disabled\"\n            :id=\"`A${answer.id}`\"\n            :name=\"`Q${value.id}`\"\n            @change=\"handleInputChange(answer.id)\"\n            :checked=\"selectedAnswerId === answer.id\"\n          >\n          <span class=\"radio marker\"></span>\n        </div>\n        <span class=\"label pl-2 py-1\">{{ answer.text }}</span>\n      </label>\n    </li>\n    <validation-provider :rules=\"rules\" v-slot=\"{ errors }\" :name=\"value.text\">\n      <input type=\"text\" v-model=\"selectedAnswerId\" style=\"display: none;\">\n      <p class=\"text-danger small\">{{ errors.join(' ') }}</p>\n    </validation-provider>\n  </ul>\n</template>\n\n<script>\n  import { required } from 'vee-validate/dist/rules'\n  import { ValidationProvider, extend } from 'vee-validate'\n\n  extend('required', {\n    ...required,\n    message: 'Field is required.'\n  })\n\n  export default {\n    components: { ValidationProvider },\n    props: {\n      disabled: {\n        type: Boolean,\n        default: false\n      },\n      value: {\n        type: Object,\n        default: () => { return { possible_answers: [], possible_answers_selected: [] } }\n      },\n    },\n    computed: {\n      rules () {\n        return this.value.required ? 'required' : null\n      },\n      selectedAnswerId () {\n        if (!this.value.possible_answers_selected[0]) {\n          return null\n        }\n\n        return this.value.possible_answers_selected[0].id\n      }\n    },\n    methods: {\n      handleInputChange (id) {\n        return this.value.possible_answers_selected = [{id: id, data: null}]\n      }\n    }\n  }\n</script>\n\n<style lang=\"scss\" scoped>\n  $marker-size: 19px;\n\n  .selector {\n    display: inline-block;\n\n    input {\n      display: none;\n    }\n\n    .marker {\n      align-items: center;\n      border-radius: $marker-size;\n      border: 1px solid #adc0c480;\n      display: flex;\n      height: $marker-size;\n      justify-content: center;\n      position: relative;\n      transition-duration: .4s;\n      width: $marker-size;\n    }\n    input:checked ~ .marker {\n      background-color: #8ec0ed;\n      border-color: #8ec0ed;\n    }\n    label:hover {\n      .marker {\n        border-color: #adc0c4;\n      }\n    }\n  }\n</style>\n",".selector {\n  display: inline-block;\n}\n.selector input {\n  display: none;\n}\n.selector .marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.selector input:checked ~ .marker {\n  background-color: #8ec0ed;\n  border-color: #8ec0ed;\n}\n.selector label:hover .marker {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Radio.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = "data-v-24a7523b";
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

//

extend('required', Object.assign({}, required,
  {message: 'Field is required.'}));

var script$2 = {
  components: { ValidationProvider: ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function () { return { possible_answers: [], possible_answers_selected: [] } }
    },
  },
  data: function data () {
    return {
      output: this.value,
      otherText: null,
      selectedAnswers: []
    }
  },
  created: function created () {
    var otherAnswerSelected = this.getOtherAnswerSelected();

    if (otherAnswerSelected) {
      this.otherText = otherAnswerSelected.data;
    }
  },
  methods: {
    getOtherAnswerSelected: function getOtherAnswerSelected () {
      var otherAnswer = this.value.possible_answers.find(function (i) { return i.text.toLowerCase() === 'other'; });

      if (!otherAnswer) {
        return null
      }

      return this.value.possible_answers_selected.find(function (i) { return i.id === otherAnswer.id; })
    },
    isSelected: function isSelected(id) {
      return this.value.possible_answers_selected.find(function (i) { return i.id === id; })
    },
    setAnswerData: function setAnswerData (id, data) {
      this.output.possible_answers_selected.filter(function (i) { return i.id !== id; }).concat({ id: id, data: data });
      return this.$emit('input', output)
    },
    handleInputChange: function handleInputChange (id, data) {
      if ( data === void 0 ) data = null;

      if (this.isSelected(id)) {

        var answer = this.value.possible_answers.find(function (i) { return i.id === id; });

        if (answer && answer.text.toLowerCase() === 'other') {
          this.otherText = null;
        }

        return this.value.possible_answers_selected = this.value.possible_answers_selected.filter(function (o) { return o.id !== id; })
      }

      this.output.possible_answers_selected = this.value.possible_answers_selected.concat({ id: id, data: data });

      return this.$emit('input', output)
    }
  }
};

var img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wwSAx4CW+1RMwAABTRJREFUaEPVmV1sFFUYhp8z25ZQAhp3twWFGg2a4JWIcgPYs6DR+INR4u+FiSHRKJZ2B0MiMRFM1AvKTCnghQKJiaCJYiIkigl0Dz+JREIIKtFEKkiVtN3ZaBFaLN05Xmy33bYzs/3ZbdfnZrPnfb/dvPOdM+fsrOB/jqWSNSH3+sJ8vpLGUs6rlkrtAyjLZy5FmlRHpUvZz+DuNWVkFYCRr6hUsFWy/7VzpUvZVYE+aMrom3aiI09lCWErBwBLOVstldKWcj7PjCcHPMK7tLTYqpIz0oivQKwA/a0pIw8P95R8EFt1ztGEfgFmgW4NYSxAX7teH7t5iK+kg1jKWQbiaOadPmfKyB1+3pJb7M0tbQBYyokPhoDyvu67txz5y7eupG6/zS1trF0+D0ulNgJvAxoQhk7fWfdAzdWg2pIJYimHtTKCpRwLiPcPC3AfbYhV/RpUCyUytSzlYGZC7AIRH1TYaMro19tbfvetzVIyi91Szg4Qrw2O6E9NGXnBv2IoU9qRwY0utXdoCC4Z9L24WXV5F3owZR2xVZK4jGIpZw+I3Ct/JUR6br2sGn0Kpqgjm491ZUNsHhYC0E/Uy6qupjGeoSa9I3YiSTwWxVJOI4h1Q1X9likj73pXBjPpQQDsRPJ1LYxtw4bPCK0XxWORtGdRHiZtamWniqWSj3mE6J377w8LxxsCJjFIQ6yappbOB8E4MFwT6MefeSimtx++4FE5OiZtatnKmaMR54DKYdJuU4ZXe9WMhaIHaTzyN+W6pzJNxT+MnAGtpgzPt46kMGvDXuWjpuhT643aG0lTcRCP7xLoJ4EJh4AiBmlODBzHDwDLRjr0+riM/LhFXR4pjYOiTi1bJV/SGLs9JGea7pndS0U6HqvykMdO0YLYKrlUYxzzVt35poy2emvjoyhTy1LtIY1x0EfeVegQUISObFXtoTTlrcCtXropwwX/TihCR9KUvYd3CI3noi8MBbs6jUcvY7i9z4L4zMdyypThe320CWM0J/582VLOfABbdebz+1LmdleC+MhHTofoLVo3AIw+UfExiDOWSm3QGNMA7MToA2V/5bmUnwVm+tnq5ZweH60gCIAv9+8TF2bJqwBCu/fFY9GzwWVDsVRqHdDopxdrgedi7Dh8nqdWrtKgVwLTtTB+slTq+M79x/PeCGzVSZPqXExACGBpgFYwjDUrbgPAlJFDoOv6x5dcnrWgz1KpTZB5XDMcSznEZRUuoX0jxEEuCt373Vh/to6HgZY3JdppiM3GUikF1OZ4fgP9nCkjJ23lEJeRAcFSqT1AwCMb9x5TRk/764VjYPpkQjiYMiyBczme20F8b6nUTo2Ynh20lFNLYAj2mTJ6Ovc/jGIyZB2Y/VfbIO01r1cD3ZZyns+8Fd94eHLQ7wDEZTTYViB87ya2Si7SGCd9PF3ADR7jWT40ZfiVAL3geN6Zdhw6T1xGT4He5KUTHKJH4K5fo3SApfAEdCSzsC2V+gJY5efz4AtThp/OZyo0gRtVU6KD+lA1tpu6AswI8maZjM3Pi8BNryFWjbgfQN8CdAd5M+j38zmKxaivnq2SyzXG4SCPID1PaP1HQ6w6yFYU8h5DYODJeYvA3eDv0h/EZdWUhIAxdGRb4iJ1sRqvnR/g2oxr7TMv3XRX36bFo/7IgjKqjgDUxWqwB3f+C8NkVX39xJSFgDF0JJcm1VHlUpZzEnRrTBlt868oPqPuSBZbJWmQ1Z3AI5kR/Ykpo21eJ+TJZFwdyWKr5Hq0PtpVET2xccmEPmrC/AfH0Nx8Veqa4AAAAABJRU5ErkJggg==';

/* script */
var __vue_script__$2 = script$2;
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "ul",
    { staticClass: "list-unstyled", class: "_" + _vm.value.type },
    [
      _vm._l(_vm.value.possible_answers, function(answer, answerIndex) {
        return _c("li", { key: answer.id }, [
          _c("label", { staticClass: "row" }, [
            _c("div", { staticClass: "selector py-1" }, [
              _c("input", {
                attrs: {
                  type: "checkbox",
                  disabled: _vm.disabled,
                  id: "A" + answer.id,
                  name: "Q" + _vm.value.id
                },
                domProps: { checked: _vm.isSelected(answer.id) },
                on: {
                  change: function($event) {
                    return _vm.handleInputChange(answer.id)
                  }
                }
              }),
              _vm._v(" "),
              _vm._m(0, true)
            ]),
            _vm._v(" "),
            answer.text.toLowerCase() === "other" && _vm.isSelected(answer.id)
              ? _c("span", { staticClass: "input" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.otherText,
                        expression: "otherText"
                      }
                    ],
                    staticClass: "ml-2",
                    attrs: { type: "text" },
                    domProps: { value: _vm.otherText },
                    on: {
                      input: [
                        function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.otherText = $event.target.value;
                        },
                        function($event) {
                          return _vm.setAnswerData(answer.id, _vm.otherText)
                        }
                      ]
                    }
                  })
                ])
              : _c("span", { staticClass: "label pl-2 py-1" }, [
                  _vm._v(_vm._s(answer.text))
                ])
          ])
        ])
      }),
      _vm._v(" "),
      _c("validation-provider", {
        attrs: {
          rules: _vm.value.required ? "required" : null,
          name: _vm.value.text
        },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var errors = ref.errors;
              return [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.value.possible_answers_selected,
                      expression: "value.possible_answers_selected"
                    }
                  ],
                  staticStyle: { display: "none" },
                  attrs: { type: "text" },
                  domProps: { value: _vm.value.possible_answers_selected },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.value,
                        "possible_answers_selected",
                        $event.target.value
                      );
                    }
                  }
                }),
                _vm._v(" "),
                _c("p", { staticClass: "small text-danger" }, [
                  _vm._v(_vm._s(errors.join(" ")))
                ])
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("validation-provider", {
        attrs: {
          rules: _vm.getOtherAnswerSelected() ? "required" : null,
          name: _vm.value.text + " (Specify)",
          "custom-messages": { required: "Please specify" },
          immediate: ""
        },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var errors = ref.errors;
              return [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.otherText,
                      expression: "otherText"
                    }
                  ],
                  staticStyle: { display: "none" },
                  attrs: { type: "text" },
                  domProps: { value: _vm.otherText },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.otherText = $event.target.value;
                    }
                  }
                }),
                _vm._v(" "),
                _c("p", { staticClass: "small text-danger" }, [
                  _vm._v(_vm._s(errors.join(" ")))
                ])
              ]
            }
          }
        ])
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$2 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "marker checkbox" }, [
      _c("img", {
        staticClass: "icon",
        attrs: { src: img }
      })
    ])
  }
];
__vue_render__$2._withStripped = true;

  /* style */
  var __vue_inject_styles__$2 = function (inject) {
    if (!inject) { return }
    inject("data-v-aa504e64_0", { source: ".selector[data-v-aa504e64] {\n  display: inline-block;\n}\n.selector input[type=checkbox][data-v-aa504e64],\n.selector input[type=radio][data-v-aa504e64] {\n  display: none;\n}\n.selector .marker[data-v-aa504e64] {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.selector .icon[data-v-aa504e64] {\n  position: absolute;\n  top: -25px;\n  left: -12px;\n  transform: scale(0);\n  transition-duration: 0.4s;\n}\n.selector input:checked ~ .marker[data-v-aa504e64] {\n  border-color: #8ec0ed;\n}\n.selector input:checked ~ .marker .icon[data-v-aa504e64] {\n  transform: scale(0.5);\n}\n.selector input[type=radio]:checked ~ .marker[data-v-aa504e64] {\n  background-color: #8ec0ed;\n}\n.selector .label[data-v-aa504e64] {\n  padding: 0 0 0 10px;\n}\n.selector label:hover .marker[data-v-aa504e64] {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Checkbox.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/components/Questions/Checkbox.vue","Checkbox.vue"],"names":[],"mappings":"AA0GA;EACA,qBAAA;ACzGA;AD0GA;;EAEA,aAAA;ACxGA;AD0GA;EACA,mBAAA;EACA,mBAVA;EAWA,2BAAA;EACA,aAAA;EACA,YAbA;EAcA,uBAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAjBA;ACvFA;AD0GA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;EACA,mBAAA;EACA,yBAAA;ACxGA;AD0GA;EACA,qBAAA;ACxGA;ADyGA;EACA,qBAAA;ACvGA;AD0GA;EACA,yBAAA;ACxGA;AD2GA;EACA,mBAAA;ACzGA;AD6GA;EACA,qBAAA;AC3GA;;AAEA,uCAAuC","file":"Checkbox.vue","sourcesContent":["<template>\n  <ul class=\"list-unstyled\" :class=\"`_${value.type}`\">\n    <li v-for=\"(answer, answerIndex) in value.possible_answers\" :key=\"answer.id\">\n      <label class=\"row\">\n        <div class=\"selector py-1\">\n          <input type=\"checkbox\"\n            :checked=\"isSelected(answer.id)\"\n            :disabled=\"disabled\"\n            :id=\"`A${answer.id}`\"\n            :name=\"`Q${value.id}`\"\n            @change=\"handleInputChange(answer.id)\"\n          >\n          <span class=\"marker checkbox\"><img src=\"./../../assets/images/check.png\" class=\"icon\"></span>\n        </div>\n        <span v-if=\"answer.text.toLowerCase() === 'other' && isSelected(answer.id)\" class=\"input\">\n          <input class=\"ml-2\" type=\"text\" v-model=\"otherText\" @input=\"setAnswerData(answer.id, otherText)\">\n        </span>\n        <span v-else class=\"label pl-2 py-1\">{{ answer.text }}</span>\n      </label>\n    </li>\n      <validation-provider :rules=\"value.required ? 'required' : null\" v-slot=\"{ errors }\" :name=\"value.text\">\n        <input type=\"text\" v-model=\"value.possible_answers_selected\" style=\"display: none;\">\n        <p class=\"small text-danger\">{{ errors.join(' ') }}</p>\n      </validation-provider>\n      <validation-provider :rules=\"getOtherAnswerSelected() ? 'required' : null\" v-slot=\"{ errors }\" :name=\"`${value.text} (Specify)`\" :custom-messages=\"{required: 'Please specify'}\" immediate>\n        <input type=\"text\" v-model=\"otherText\" style=\"display: none;\">\n        <p class=\"small text-danger\">{{ errors.join(' ') }}</p>\n      </validation-provider>\n  </ul>\n</template>\n\n<script>\n  import { ValidationProvider, extend } from 'vee-validate'\n  import { required } from 'vee-validate/dist/rules'\n\n  extend('required', {\n    ...required,\n    message: 'Field is required.'\n  })\n\n  export default {\n    components: { ValidationProvider },\n    props: {\n      disabled: {\n        type: Boolean,\n        default: false\n      },\n      value: {\n        type: Object,\n        default: () => { return { possible_answers: [], possible_answers_selected: [] } }\n      },\n    },\n    data () {\n      return {\n        output: this.value,\n        otherText: null,\n        selectedAnswers: []\n      }\n    },\n    created () {\n      const otherAnswerSelected = this.getOtherAnswerSelected()\n\n      if (otherAnswerSelected) {\n        this.otherText = otherAnswerSelected.data\n      }\n    },\n    methods: {\n      getOtherAnswerSelected () {\n        const otherAnswer = this.value.possible_answers.find(i => i.text.toLowerCase() === 'other')\n\n        if (!otherAnswer) {\n          return null\n        }\n\n        return this.value.possible_answers_selected.find(i => i.id === otherAnswer.id)\n      },\n      isSelected(id) {\n        return this.value.possible_answers_selected.find(i => i.id === id)\n      },\n      setAnswerData (id, data) {\n        this.output.possible_answers_selected.filter(i => i.id !== id).concat({ id: id, data: data })\n        return this.$emit('input', output)\n      },\n      handleInputChange (id, data = null) {\n        if (this.isSelected(id)) {\n\n          const answer = this.value.possible_answers.find(i => i.id === id)\n\n          if (answer && answer.text.toLowerCase() === 'other') {\n            this.otherText = null\n          }\n\n          return this.value.possible_answers_selected = this.value.possible_answers_selected.filter(o => o.id !== id)\n        }\n\n        this.output.possible_answers_selected = this.value.possible_answers_selected.concat({ id: id, data: data })\n\n        return this.$emit('input', output)\n      }\n    }\n  }\n</script>\n\n<style lang=\"scss\" scoped>\n  $marker-size: 19px;\n\n  .selector {\n    display: inline-block;\n    input[type=\"checkbox\"],\n    input[type=\"radio\"] {\n      display: none;\n    }\n    .marker {\n      align-items: center;\n      border-radius: $marker-size;\n      border: 1px solid #adc0c480;\n      display: flex;\n      height: $marker-size;\n      justify-content: center;\n      position: relative;\n      transition-duration: .4s;\n      width: $marker-size;\n    }\n    .icon {\n      position: absolute;\n      top: -25px;\n      left: -12px;\n      transform: scale(0);\n      transition-duration: .4s;\n    }\n    input:checked ~ .marker {\n      border-color: #8ec0ed;\n      .icon {\n        transform: scale(.5);\n      }\n    }\n    input[type='radio']:checked ~ .marker {\n      background-color: #8ec0ed;\n    }\n\n    .label {\n      padding: 0 0 0 10px;\n    }\n\n    label:hover {\n      .marker {\n        border-color: #adc0c4;\n      }\n    }\n  }\n</style>\n",".selector {\n  display: inline-block;\n}\n.selector input[type=checkbox],\n.selector input[type=radio] {\n  display: none;\n}\n.selector .marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.selector .icon {\n  position: absolute;\n  top: -25px;\n  left: -12px;\n  transform: scale(0);\n  transition-duration: 0.4s;\n}\n.selector input:checked ~ .marker {\n  border-color: #8ec0ed;\n}\n.selector input:checked ~ .marker .icon {\n  transform: scale(0.5);\n}\n.selector input[type=radio]:checked ~ .marker {\n  background-color: #8ec0ed;\n}\n.selector .label {\n  padding: 0 0 0 10px;\n}\n.selector label:hover .marker {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Checkbox.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$2 = "data-v-aa504e64";
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

//

extend('required', Object.assign({}, required,
  {message: 'Field is required.'}));

var script$3 = {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function () { return { possible_answers: [], possible_answers_selected: [] } }
    },
  },
  created: function created () {
    if (!this.value.possible_answers_selected[0]) {
      var centerIndex = Math.ceil(this.value.possible_answers.length / 2) - 1;
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[centerIndex].id, data: null }];
    }
  },
  components: {
    RangeSlider: RangeSlider,
    ValidationProvider: ValidationProvider
  },
  computed: {
    selectedId: {
      get: function get () {
        var this$1 = this;

        return this.value.possible_answers.findIndex(function (item) { return item.id === this$1.value.possible_answers_selected[0].id; }) + 1
      },
      set: function set (val) {
        this.value.possible_answers_selected = [{ id: this.value.possible_answers[val - 1].id, data: true }];
      }
    }
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "label",
    [
      _c("range-slider", {
        staticClass: "slider",
        attrs: {
          min: "1",
          max: _vm.value.possible_answers.length,
          step: "1",
          disabled: _vm.disabled
        },
        model: {
          value: _vm.selectedId,
          callback: function($$v) {
            _vm.selectedId = $$v;
          },
          expression: "selectedId"
        }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "selection" }, [
        _c("div", { staticClass: "w-25 small text-left" }, [
          _vm._v(_vm._s(_vm.value.possible_answers[0].text))
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "w-50 text-center" }, [
          _vm._v(_vm._s(_vm.selectedId))
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "w-25 small text-right" }, [
          _vm._v(
            _vm._s(
              _vm.value.possible_answers[_vm.value.possible_answers.length - 1]
                .text
            )
          )
        ])
      ]),
      _vm._v(" "),
      _c("validation-provider", {
        attrs: {
          rules: { required: _vm.value.required },
          name: _vm.value.text
        },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var errors = ref.errors;
              return [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.value.possible_answers_selected[0].data,
                      expression: "value.possible_answers_selected[0].data"
                    }
                  ],
                  staticStyle: { display: "none" },
                  attrs: { type: "text" },
                  domProps: {
                    value: _vm.value.possible_answers_selected[0].data
                  },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.value.possible_answers_selected[0],
                        "data",
                        $event.target.value
                      );
                    }
                  }
                }),
                _vm._v(" "),
                _c("p", { staticClass: "text-danger small" }, [
                  _vm._v(_vm._s(errors.join(" ")))
                ])
              ]
            }
          }
        ])
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  var __vue_inject_styles__$3 = function (inject) {
    if (!inject) { return }
    inject("data-v-26ea3916_0", { source: ".selection {\n  display: flex;\n}\n.range-slider-inner {\n  min-width: 80px;\n}\n.range-slider {\n  box-sizing: border-box;\n  display: block;\n  height: 40px;\n  margin-bottom: 10px;\n  width: 100%;\n}\n.range-slider .range-slider-knob {\n  background-color: #8ec0ed;\n  border: none;\n  height: 25px;\n  width: 25px;\n}\n.range-slider input[type=text] {\n  background: transparent;\n  border: none;\n  color: #004D50;\n  cursor: default;\n  font-size: 1rem;\n  padding-top: 40px;\n  text-align: center;\n  user-select: none;\n}\n.range-slider .range-slider-fill {\n  background-color: #8ec0ed30;\n  border-radius: 25px;\n  height: 25px;\n}\n.range-slider .range-slider-rail {\n  background-color: #e7e9e730;\n  border-radius: 25px;\n  height: 25px;\n}\n\n/*# sourceMappingURL=Scale.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/components/Questions/Scale.vue","Scale.vue"],"names":[],"mappings":"AAsEA;EACA,aAAA;ACrEA;ADuEA;EACA,eAAA;ACpEA;ADsEA;EACA,sBAAA;EACA,cAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;ACnEA;ADqEA;EACA,yBAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;ACnEA;ADsEA;EACA,uBAAA;EACA,YAAA;EACA,cAAA;EACA,eAAA;EACA,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,iBAAA;ACpEA;ADsEA;EACA,2BAAA;EACA,mBAAA;EACA,YAAA;ACpEA;ADsEA;EACA,2BAAA;EACA,mBAAA;EACA,YAAA;ACpEA;;AAEA,oCAAoC","file":"Scale.vue","sourcesContent":["<template>\n  <label>\n    <range-slider class=\"slider\"\n      min=\"1\"\n      :max=\"value.possible_answers.length\"\n      step=\"1\"\n      v-model=\"selectedId\"\n      :disabled=\"disabled\">\n    </range-slider>\n\n    <div class=\"selection\">\n      <div class=\"w-25 small text-left\">{{ value.possible_answers[0].text }}</div>\n      <div class=\"w-50 text-center\" style=\"\">{{ selectedId }}</div>\n      <div class=\"w-25 small text-right\">{{ value.possible_answers[value.possible_answers.length - 1].text }}</div>\n    </div>\n\n    <validation-provider :rules=\"{ 'required': value.required }\" v-slot=\"{ errors }\" :name=\"value.text\">\n      <input type=\"text\" v-model=\"value.possible_answers_selected[0].data\" style=\"display: none;\">\n      <p class=\"text-danger small\">{{ errors.join(' ') }}</p>\n    </validation-provider>\n\n  </label>\n</template>\n\n<script>\nimport RangeSlider from 'vue-range-slider'\nimport { integer, required } from 'vee-validate/dist/rules'\nimport { ValidationProvider, extend } from 'vee-validate'\n\nimport 'vue-range-slider/dist/vue-range-slider.css'\n\nextend('required', {\n  ...required,\n  message: 'Field is required.'\n})\n\nexport default {\n  props: {\n    disabled: {\n      type: Boolean,\n      default: false\n    },\n    value: {\n      type: Object,\n      default: () => { return { possible_answers: [], possible_answers_selected: [] } }\n    },\n  },\n  created () {\n    if (!this.value.possible_answers_selected[0]) {\n      const centerIndex = Math.ceil(this.value.possible_answers.length / 2) - 1\n      this.value.possible_answers_selected = [{ id: this.value.possible_answers[centerIndex].id, data: null }]\n    }\n  },\n  components: {\n    RangeSlider,\n    ValidationProvider\n  },\n  computed: {\n    selectedId: {\n      get () {\n        return this.value.possible_answers.findIndex((item) => item.id === this.value.possible_answers_selected[0].id) + 1\n      },\n      set (val) {\n        this.value.possible_answers_selected = [{ id: this.value.possible_answers[val - 1].id, data: true }]\n      }\n    }\n  }\n}\n</script>\n<style lang=\"scss\">\n  .selection {\n    display: flex;\n  }\n  .range-slider-inner {\n    min-width: 80px;\n  }\n  .range-slider {\n    box-sizing: border-box;\n    display: block;\n    height: 40px;\n    margin-bottom: 10px;\n    width: 100%;\n\n    .range-slider-knob {\n      background-color: #8ec0ed;\n      border: none;\n      height: 25px;\n      width: 25px;\n    }\n\n    input[type=\"text\"] {\n      background: transparent;\n      border: none;\n      color: #004D50;\n      cursor: default;\n      font-size: 1rem;\n      padding-top: 40px;\n      text-align: center;\n      user-select: none;\n    }\n    .range-slider-fill {\n      background-color: #8ec0ed30;\n      border-radius: 25px;\n      height: 25px;\n    }\n    .range-slider-rail {\n      background-color: #e7e9e730;\n      border-radius: 25px;\n      height: 25px;\n    }\n}\n</style>\n",".selection {\n  display: flex;\n}\n\n.range-slider-inner {\n  min-width: 80px;\n}\n\n.range-slider {\n  box-sizing: border-box;\n  display: block;\n  height: 40px;\n  margin-bottom: 10px;\n  width: 100%;\n}\n.range-slider .range-slider-knob {\n  background-color: #8ec0ed;\n  border: none;\n  height: 25px;\n  width: 25px;\n}\n.range-slider input[type=text] {\n  background: transparent;\n  border: none;\n  color: #004D50;\n  cursor: default;\n  font-size: 1rem;\n  padding-top: 40px;\n  text-align: center;\n  user-select: none;\n}\n.range-slider .range-slider-fill {\n  background-color: #8ec0ed30;\n  border-radius: 25px;\n  height: 25px;\n}\n.range-slider .range-slider-rail {\n  background-color: #e7e9e730;\n  border-radius: 25px;\n  height: 25px;\n}\n\n/*# sourceMappingURL=Scale.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$3 = undefined;
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    createInjector,
    undefined,
    undefined
  );

//

extend('regex', Object.assign({}, regex,
  {message: "Field must match the 'MM-DD-YYYY' pattern."}));

extend('required', Object.assign({}, required,
  {message: 'Field is required.'}));

var script$4 = {
  components: {
    DatePick: DatePick,
    ValidationProvider: ValidationProvider
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function () { return { possible_answers: [{}], possible_answers_selected: [] } }
    },
  },
  created: function created () {
    if (!this.value.possible_answers_selected[0]) {
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }];
    }
  },
  methods: {
    isFutureDate: function isFutureDate (date) {
      return moment(date).isAfter(moment().subtract(1, 'day'))
    },
    dateSelected: function dateSelected(date) {
      this.$refs.validationProvider.validate();
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: date }];
    }
  }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "input" },
    [
      _c("validation-provider", {
        ref: "validationProvider",
        attrs: {
          rules: { required: true, regex: /^\d{2}-\d{2}-\d{4}$/ },
          name: _vm.value.text
        },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var errors = ref.errors;
              return [
                _c("date-pick", {
                  ref: "datePicker",
                  attrs: {
                    isDateDisabled: _vm.isFutureDate,
                    inputAttributes: { readonly: false },
                    editable: !_vm.disabled,
                    format: "MM-DD-YYYY"
                  },
                  on: { change: _vm.dateSelected },
                  model: {
                    value: _vm.value.possible_answers_selected[0].data,
                    callback: function($$v) {
                      _vm.$set(
                        _vm.value.possible_answers_selected[0],
                        "data",
                        $$v
                      );
                    },
                    expression: "value.possible_answers_selected[0].data"
                  }
                }),
                _vm._v(" "),
                _c("p", { staticClass: "text-danger small" }, [
                  _vm._v(_vm._s(errors.join(" ")))
                ])
              ]
            }
          }
        ])
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  var __vue_inject_styles__$4 = function (inject) {
    if (!inject) { return }
    inject("data-v-5fd549ed_0", { source: ".vdpClearInput {\n  display: none;\n}\n.vdpCellContent {\n  font-size: 13px;\n}\n.vdpComponent {\n  width: 100%;\n}\n.vdpComponent input {\n  font-size: 16px;\n  width: 100%;\n}\n\n/*# sourceMappingURL=Date.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/components/Questions/Date.vue","Date.vue"],"names":[],"mappings":"AAmEA;EACA,aAAA;AClEA;ADoEA;EACA,eAAA;ACjEA;ADmEA;EACA,WAAA;AChEA;ADkEA;EACA,eAAA;EACA,WAAA;AChEA;;AAEA,mCAAmC","file":"Date.vue","sourcesContent":["<template>\n  <div class=\"input\">\n    <validation-provider ref=\"validationProvider\" :rules=\"{ required: true, regex: /^\\d{2}-\\d{2}-\\d{4}$/ }\" v-slot=\"{ errors }\" :name=\"value.text\" >\n      <date-pick ref=\"datePicker\"\n        v-model=\"value.possible_answers_selected[0].data\"\n        :isDateDisabled=\"isFutureDate\"\n        :inputAttributes=\"{readonly: false}\"\n        :editable=\"!disabled\"\n        format=\"MM-DD-YYYY\"\n        @change=\"dateSelected\">\n      </date-pick>\n      <p class=\"text-danger small\">{{ errors.join(' ') }}</p>\n    </validation-provider>\n  </div>\n</template>\n\n<script>\nimport 'vue-date-pick/dist/vueDatePick.css';\nimport DatePick from 'vue-date-pick';\nimport moment from 'moment';\n\nimport { regex, required } from 'vee-validate/dist/rules'\nimport { ValidationProvider, extend } from 'vee-validate'\n\nextend('regex', {\n  ...regex,\n  message: \"Field must match the 'MM-DD-YYYY' pattern.\"\n})\n\nextend('required', {\n  ...required,\n  message: 'Field is required.'\n})\n\nexport default {\n  components: {\n    DatePick,\n    ValidationProvider\n  },\n  props: {\n    disabled: {\n      type: Boolean,\n      default: false\n    },\n    value: {\n      type: Object,\n      default: () => { return { possible_answers: [{}], possible_answers_selected: [] } }\n    },\n  },\n  created () {\n    if (!this.value.possible_answers_selected[0]) {\n      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }]\n    }\n  },\n  methods: {\n    isFutureDate (date) {\n      return moment(date).isAfter(moment().subtract(1, 'day'))\n    },\n    dateSelected(date) {\n      this.$refs.validationProvider.validate()\n      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: date }]\n    }\n  }\n}\n</script>\n\n<style lang=\"scss\">\n  .vdpClearInput {\n    display: none;\n  }\n  .vdpCellContent {\n    font-size: 13px;\n  }\n  .vdpComponent {\n    width: 100%;\n\n    input {\n      font-size: 16px;\n      width: 100%;\n    }\n  }\n</style>\n",".vdpClearInput {\n  display: none;\n}\n\n.vdpCellContent {\n  font-size: 13px;\n}\n\n.vdpComponent {\n  width: 100%;\n}\n.vdpComponent input {\n  font-size: 16px;\n  width: 100%;\n}\n\n/*# sourceMappingURL=Date.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$4 = undefined;
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    createInjector,
    undefined,
    undefined
  );

//

var script$5 = {
  name: 'Duckform',
  components: {
    CheckboxQuestion: __vue_component__$2,
    DateQuestion: __vue_component__$4,
    InputQuestion: __vue_component__,
    RadioQuestion: __vue_component__$1,
    ScaleQuestion: __vue_component__$3,
    ValidationObserver: ValidationObserver
  },
  data: function data () {
    return {
      currentSectionIndex: 0,
      errorLoading: false,
      form: this.formData,
      formDataLoaded: false,
      formId: null,
      formSubmitted: false,
      loadingData: true,
      savingData: false,
      submit: this.submitData,
      submitDataLoaded: false,
      validationFailed: false,
    }
  },
  props: {
    formData: {
      type: Object,
      default: function () { return { sections: [] } }
    },
    formDataEndpoint: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submitData: {
      type: Object,
      default: function () { return { sections: [] } }
    },
    submitId: {
      type: [Number, String],
      default: null
    },
  },
  computed: {
    currentSection: function currentSection () {
      return this.form.sections[this.currentSectionIndex]
    },
    isLastSection: function isLastSection () {
      return this.currentSectionIndex + 1 >= this.form.sections.length
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    if (_.isEmpty(this.formDataEndpoint)) {
      this.proccessFormSections();
      this.getSubmitAndMerge().then(function () { this$1.loadingData = false; });
    } else {
      this.getForm().then(function () {
        this$1.getSubmitAndMerge().then(function () { this$1.loadingData = false; });
      });
    }
  },
  methods: {
    filterArray: function filterArray(errors) {
      var errorIndexes = Object.values(errors).map(function (v, k) { return v.length ? k : null }).filter(function (i) { return i !== null; });

      return Object.keys(errors).filter(function (v, k) { return errorIndexes.indexOf(k) >= 0; })
    },
    getForm: function getForm () {
      var this$1 = this;

      return axios.get(this.formDataEndpoint).then(function (response) {
        this$1.form = response.data.data;
        this$1.proccessFormSections();
      }).catch(function () {
        this$1.errorLoading = true;
      }).finally(function () {
        this$1.formDataLoaded = true;
      })
    },
    getSubmit: function getSubmit () {
      var this$1 = this;

      return axios.get(((this.formDataEndpoint) + "/submits/" + (this.submitId))).then(function (response) {
        this$1.submit = response.data.data;
        this$1.formSubmitted = !_.isEmpty(response.data.data.completed_at);
      }).catch(function () {
        this$1.errorLoading = true;
      }).finally(function () {
        this$1.submitDataLoaded = true;
      })
    },
    getSubmitAndMerge: function getSubmitAndMerge () {
      var this$1 = this;

      if (_.isEmpty(this.submitId)) {
        this.mergeSubmitData();
        return new Promise(function (resolve) { return resolve(); })
      } else {
        return this.getSubmit().then(function () { return this$1.mergeSubmitData(); })
      }
    },
    proccessFormSections: function proccessFormSections () {
      var this$1 = this;

      this.form.sections = _.sortBy(this.form.sections, function (i) { return i.order || 0; }).map(function (section) {
        section.questions.map(function (question) {
          question.possible_answers = _.sortBy(question.possible_answers, function (i) { return i.order || 0; });
          this$1.$set(question, 'possible_answers_selected', []);
          return question
        });
        return section
      });
    },
    mergeSubmitData: function mergeSubmitData() {
      var savedSectionsArranged = _.keyBy(this.submit.sections.map(function (section) {
        section.questions = _.keyBy(section.questions, 'id');
        return section
      }), 'slug');
      var formSectionsArranged = _.keyBy(this.form.sections.map(function (section) {
        section.questions = _.keyBy(section.questions, 'id');
        return section
      }), 'slug');
      this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged));
    },
    nextSection: function nextSection () {
      var this$1 = this;

      this.$refs.validationObserver.validate().then(function (success) {
        if (!success) {
          this$1.validationFailed = true;
          return false
        }

        this$1.validationFailed = false;

        this$1.save().then(function () {
          if (this$1.currentSectionIndex + 1 < this$1.form.sections.length) {
            this$1.currentSectionIndex++;
            this$1.$refs.surveyTop.scrollIntoView();
          }
        });
      });
    },
    prevSection: function prevSection () {
      if (this.currentSectionIndex > 0) {
        this.currentSectionIndex--;
        this.$refs.surveyTop.scrollIntoView();
      }
    },
    save: function save () {
      var this$1 = this;

      this.savingData = true;
      var responseHandler = function (response) {
        this$1.submit = response.data.data;
        this$1.mergeSubmitData();

        if (this$1.isLastSection) {
          this$1.formSubmitted = !_.isEmpty(response.data.data.completed_at);
        }
      };

      if (this.submit.token) {
        return axios.patch(((this.formDataEndpoint) + "/submits/" + (this.submit.token)), { data: this.form }).then(responseHandler).finally(function () { this$1.savingData = false; })
      }

      return axios.post(((this.formDataEndpoint) + "/submits"), { data: this.form }).then(responseHandler).finally(function () { this$1.savingData = false; })
    }
  }
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "duckform" }, [
    _vm.loadingData
      ? _c(
          "div",
          [
            _vm._t(
              "loading",
              [
                _c("h1", { staticClass: "text-center" }, [
                  _vm._v(_vm._s(_vm.form.title || "Loading..."))
                ])
              ],
              { form: _vm.form }
            )
          ],
          2
        )
      : _vm.errorLoading
      ? _c(
          "div",
          [
            _vm._t(
              "errorLoading",
              [
                _c("h1", { staticClass: "text-center" }, [
                  _vm._v("Ups, there was an error loading the form.")
                ])
              ],
              { form: _vm.form }
            )
          ],
          2
        )
      : _c(
          "div",
          [
            _c("validation-observer", {
              ref: "validationObserver",
              scopedSlots: _vm._u(
                [
                  {
                    key: "default",
                    fn: function(slotProps) {
                      return [
                        _c(
                          "main",
                          { staticClass: "content" },
                          [
                            _vm.formSubmitted
                              ? _vm._t(
                                  "completed",
                                  [
                                    _c("h1", { staticClass: "text-center" }, [
                                      _vm._v("Thanks!")
                                    ]),
                                    _vm._v(" "),
                                    _c("h2", { staticClass: "text-center" }, [
                                      _vm._v("Form was submitted correctly.")
                                    ])
                                  ],
                                  { survey: _vm.form }
                                )
                              : _c("form", { ref: "surveyTop" }, [
                                  _vm.form.title
                                    ? _c(
                                        "h1",
                                        {
                                          staticClass: "text-center",
                                          staticStyle: { "font-size": "2em" }
                                        },
                                        [_vm._v(_vm._s(_vm.form.title))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  !_vm.disabled
                                    ? _c(
                                        "ul",
                                        {
                                          staticClass: "progress list-unstyled"
                                        },
                                        _vm._l(_vm.form.sections, function(
                                          section,
                                          index
                                        ) {
                                          return _c("li", {
                                            class: {
                                              active:
                                                index <= _vm.currentSectionIndex
                                            }
                                          })
                                        }),
                                        0
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c("header", [
                                    _c(
                                      "h2",
                                      { staticClass: "text-center pb-3" },
                                      [_vm._v(_vm._s(_vm.currentSection.title))]
                                    ),
                                    _vm._v(" "),
                                    _vm.currentSection.description
                                      ? _c("h3", [
                                          _vm._v(
                                            _vm._s(
                                              _vm.currentSection.description
                                            )
                                          )
                                        ])
                                      : _vm._e()
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "section",
                                    _vm._l(
                                      _vm.currentSection.questions,
                                      function(question, questionIndex) {
                                        return _c(
                                          "fieldset",
                                          {
                                            key:
                                              "S" +
                                              _vm.currentSectionIndex +
                                              "|Q" +
                                              questionIndex
                                          },
                                          [
                                            _c("header", [
                                              _c(
                                                "div",
                                                {
                                                  staticClass: "statement pb-1"
                                                },
                                                [
                                                  _vm._v(_vm._s(question.text)),
                                                  question.required
                                                    ? _c(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "text-danger small"
                                                        },
                                                        [_vm._v(" *")]
                                                      )
                                                    : _vm._e()
                                                ]
                                              )
                                            ]),
                                            _vm._v(" "),
                                            question.type === "multiselect"
                                              ? _c(
                                                  "span",
                                                  [
                                                    _c("checkbox-question", {
                                                      attrs: {
                                                        disabled: _vm.disabled
                                                      },
                                                      model: {
                                                        value:
                                                          _vm.currentSection
                                                            .questions[
                                                            questionIndex
                                                          ],
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            _vm.currentSection
                                                              .questions,
                                                            questionIndex,
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "currentSection.questions[questionIndex]"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              : _vm._e(),
                                            _vm._v(" "),
                                            question.type === "scale"
                                              ? _c(
                                                  "span",
                                                  [
                                                    _c("scale-question", {
                                                      attrs: {
                                                        disabled: _vm.disabled
                                                      },
                                                      model: {
                                                        value:
                                                          _vm.currentSection
                                                            .questions[
                                                            questionIndex
                                                          ],
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            _vm.currentSection
                                                              .questions,
                                                            questionIndex,
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "currentSection.questions[questionIndex]"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              : _vm._e(),
                                            _vm._v(" "),
                                            question.type === "date"
                                              ? _c(
                                                  "span",
                                                  [
                                                    _c("date-question", {
                                                      attrs: {
                                                        disabled: _vm.disabled
                                                      },
                                                      model: {
                                                        value:
                                                          _vm.currentSection
                                                            .questions[
                                                            questionIndex
                                                          ],
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            _vm.currentSection
                                                              .questions,
                                                            questionIndex,
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "currentSection.questions[questionIndex]"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              : _vm._e(),
                                            _vm._v(" "),
                                            ["free_text", "integer"].indexOf(
                                              question.type
                                            ) >= 0
                                              ? _c(
                                                  "span",
                                                  [
                                                    _c("input-question", {
                                                      attrs: {
                                                        disabled: _vm.disabled
                                                      },
                                                      model: {
                                                        value:
                                                          _vm.currentSection
                                                            .questions[
                                                            questionIndex
                                                          ],
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            _vm.currentSection
                                                              .questions,
                                                            questionIndex,
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "currentSection.questions[questionIndex]"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              : _vm._e(),
                                            _vm._v(" "),
                                            ["single_select", "yes_no"].indexOf(
                                              question.type
                                            ) >= 0
                                              ? _c(
                                                  "span",
                                                  [
                                                    _c("radio-question", {
                                                      attrs: {
                                                        disabled: _vm.disabled
                                                      },
                                                      model: {
                                                        value:
                                                          _vm.currentSection
                                                            .questions[
                                                            questionIndex
                                                          ],
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            _vm.currentSection
                                                              .questions,
                                                            questionIndex,
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "currentSection.questions[questionIndex]"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              : _vm._e()
                                          ]
                                        )
                                      }
                                    ),
                                    0
                                  ),
                                  _vm._v(" "),
                                  !_vm.disabled
                                    ? _c("div", { staticClass: "control" }, [
                                        _vm.validationFailed &&
                                        slotProps.invalid
                                          ? _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "small text-danger mb-4"
                                              },
                                              [
                                                _c(
                                                  "p",
                                                  { staticClass: "pb-2" },
                                                  [
                                                    _vm._v(
                                                      "Please complete the following questions:"
                                                    )
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _vm._l(
                                                  _vm.filterArray(
                                                    slotProps.errors
                                                  ),
                                                  function(errorText) {
                                                    return _c("p", [
                                                      _vm._v(
                                                        _vm._s(errorText) + "."
                                                      )
                                                    ])
                                                  }
                                                )
                                              ],
                                              2
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _vm.currentSectionIndex > 0
                                          ? _c(
                                              "button",
                                              {
                                                staticClass: "button back",
                                                attrs: { type: "button" },
                                                on: { click: _vm.prevSection }
                                              },
                                              [_vm._v("Back")]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c(
                                          "button",
                                          {
                                            staticClass: "button mt-3",
                                            attrs: { type: "button" },
                                            on: { click: _vm.nextSection }
                                          },
                                          [
                                            _vm.isLastSection
                                              ? _c("span", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.savingData
                                                        ? "Submitting..."
                                                        : "Submit"
                                                    )
                                                  )
                                                ])
                                              : _c("span", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.savingData
                                                        ? "Saving..."
                                                        : "Continue"
                                                    )
                                                  )
                                                ])
                                          ]
                                        )
                                      ])
                                    : _vm._e()
                                ])
                          ],
                          2
                        )
                      ]
                    }
                  }
                ],
                null,
                true
              )
            })
          ],
          1
        )
  ])
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  var __vue_inject_styles__$5 = function (inject) {
    if (!inject) { return }
    inject("data-v-42b05184_0", { source: ".duckform {\n  font-size: 1rem;\n}\n.duckform a {\n  transition-duration: 0.4s;\n}\n.duckform fieldset {\n  border-bottom: 1px solid #ccc;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  padding: 0 0 25px 0;\n  margin: 20px 20px 10px 20px;\n}\n.duckform button {\n  transition-duration: 0.4s;\n}\n.duckform button:focus {\n  outline: none;\n}\n.duckform button:not([disabled]) {\n  cursor: pointer;\n}\n.duckform .button {\n  background-color: #edaca0;\n  border: none;\n  color: #fff;\n  display: inline-block;\n  font-size: 1.4rem;\n  padding: 15px 30px;\n  text-decoration: none;\n  border: 1px solid #fff;\n}\n.duckform .button[disabled] {\n  background-color: #A5AFA5;\n}\n.duckform .button:not([disabled]):hover {\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #000;\n}\n.duckform .button.orange {\n  background-color: #FF5900;\n}\n.duckform .button.orange:hover {\n  background-color: #004D50;\n}\n.duckform .input label {\n  align-items: flex-start;\n  cursor: pointer;\n  display: flex;\n}\n.duckform .input input[type=text],\n.duckform .input input[type=number],\n.duckform .input input[type=date] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 5px;\n  border: 0;\n  background-color: #8ec0ed30;\n  box-shadow: none;\n  box-sizing: border-box;\n  display: block;\n  padding: 5px 10px;\n}\n.duckform .input input[type=text]:focus,\n.duckform .input input[type=number]:focus,\n.duckform .input input[type=date]:focus {\n  outline: none;\n  transition-duration: 0.4s;\n}\n.duckform .input input.other {\n  display: inline-block;\n}\n.duckform .header {\n  border-bottom: 1px solid #ddd;\n  text-align: center;\n  width: 100%;\n}\n@media (min-width: 1000px) {\n.duckform .header {\n    text-align: left;\n}\n}\n.duckform .header .center {\n  padding: 0 30px;\n}\n.duckform .header img {\n  height: auto;\n  width: 150px;\n  margin: 15px 0;\n}\n.duckform .content {\n  flex: 1 0 0;\n  padding: 25px 0 25px 0;\n  margin: 0 auto;\n  max-width: 850px;\n}\n.duckform .control {\n  padding: 20px 0;\n  text-align: center;\n}\n.duckform .control button.back {\n  background-color: transparent;\n  border: 1px solid #ccc;\n  color: #ccc;\n}\n.duckform .control button.back:hover {\n  background-color: transparent !important;\n  border-color: #000;\n  color: #000;\n}\n.duckform .progress {\n  display: flex;\n  margin: 0;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n.duckform .progress li {\n  flex-grow: 1;\n  font-size: 12px;\n  text-align: center;\n  transition-duration: 0.4s;\n  border-top: 7px solid #555;\n  opacity: 0.25;\n}\n.duckform .progress li.active {\n  opacity: 1;\n  border-top-color: #0000ff;\n}\n\n/*# sourceMappingURL=Duckform.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/Duckform.vue","Duckform.vue"],"names":[],"mappings":"AAkPA;EACA,eAAA;ACjPA;ADmPA;EACA,yBAAA;ACjPA;ADoPA;EACA,6BAAA;EACA,cAAA;EACA,eAAA;EACA,aAAA;EACA,mBAAA;EACA,2BAAA;AClPA;ADqPA;EACA,yBAAA;ACnPA;ADoPA;EAAA,aAAA;ACjPA;ADkPA;EAAA,eAAA;AC/OA;ADkPA;EACA,yBAAA;EACA,YAAA;EACA,WAAA;EACA,qBAAA;EACA,iBAAA;EACA,kBAAA;EACA,qBAAA;EACA,sBAAA;AChPA;ADkPA;EACA,yBAAA;AChPA;ADkPA;EACA,sBAAA;EACA,WAAA;EACA,sBAAA;AChPA;ADkPA;EACA,yBAAA;AChPA;ADkPA;EACA,yBAAA;AChPA;ADwPA;EACA,uBAAA;EACA,eAAA;EACA,aAAA;ACtPA;ADwPA;;;EAGA,wBAAA;EACA,qBAAA;EACA,gBAAA;EAEA,kBAAA;EACA,SAAA;EACA,2BAAA;EACA,gBAAA;EACA,sBAAA;EACA,cAAA;EACA,iBAAA;ACvPA;ADwPA;;;EACA,aAAA;EACA,yBAAA;ACpPA;ADuPA;EACA,qBAAA;ACrPA;ADyPA;EACA,6BAAA;EACA,kBAAA;EACA,WAAA;ACvPA;ADwPA;AAJA;IAKA,gBAAA;ACrPE;AACF;ADsPA;EACA,eAAA;ACpPA;ADsPA;EACA,YAAA;EACA,YAAA;EACA,cAAA;ACpPA;ADwPA;EACA,WAAA;EACA,sBAAA;EACA,cAAA;EACA,gBAAA;ACtPA;ADyPA;EACA,eAAA;EACA,kBAAA;ACvPA;ADyPA;EACA,6BAAA;EACA,sBAAA;EACA,WAAA;ACvPA;ADwPA;EACA,wCAAA;EACA,kBAAA;EACA,WAAA;ACtPA;AD2PA;EACA,aAAA;EACA,SAAA;EACA,eAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,UAAA;ACzPA;AD0PA;EACA,YAAA;EACA,eAAA;EACA,kBAAA;EACA,yBAAA;EACA,0BAAA;EACA,aAAA;ACxPA;ADyPA;EACA,UAAA;EACA,yBAAA;ACvPA;;AAEA,uCAAuC","file":"Duckform.vue","sourcesContent":["<template>\n  <div class=\"duckform\">\n    <div v-if=\"loadingData\">\n      <slot name=\"loading\" v-bind:form=\"form\">\n        <h1 class=\"text-center\">{{ form.title || 'Loading...' }}</h1>\n      </slot>\n    </div>\n    <div v-else-if=\"errorLoading\">\n      <slot name=\"errorLoading\" v-bind:form=\"form\">\n        <h1 class=\"text-center\">Ups, there was an error loading the form.</h1>\n      </slot>\n    </div>\n    <div v-else>\n      <validation-observer ref=\"validationObserver\" v-slot=\"slotProps\">\n        <main class=\"content\">\n          <slot name=\"completed\" v-if=\"formSubmitted\" v-bind:survey=\"form\">\n            <h1 class=\"text-center\">Thanks!</h1>\n            <h2 class=\"text-center\">Form was submitted correctly.</h2>\n          </slot>\n          <form v-else ref=\"surveyTop\">\n            <h1 v-if=\"form.title\" style=\"font-size: 2em\" class=\"text-center\">{{ form.title }}</h1>\n            <ul v-if=\"!disabled\" class=\"progress list-unstyled\">\n              <li v-for=\"(section, index) in form.sections\" :class=\"{'active': index <= currentSectionIndex}\"></li>\n            </ul>\n            <header>\n              <h2 class=\"text-center pb-3\">{{ currentSection.title }}</h2>\n              <h3 v-if=\"currentSection.description\">{{ currentSection.description }}</h3>\n            </header>\n            <section>\n              <fieldset v-for=\"(question, questionIndex) in currentSection.questions\" :key=\"`S${currentSectionIndex}|Q${questionIndex}`\">\n                <header>\n                  <div class=\"statement pb-1\">{{ question.text }}<span v-if=\"question.required\" class=\"text-danger small\"> *</span></div>\n                </header>\n                <span v-if=\"question.type === 'multiselect'\">\n                  <checkbox-question v-model=\"currentSection.questions[questionIndex]\" :disabled=\"disabled\"></checkbox-question>\n                </span>\n                <span v-if=\"question.type === 'scale'\">\n                  <scale-question v-model=\"currentSection.questions[questionIndex]\" :disabled=\"disabled\"></scale-question>\n                </span>\n                <span v-if=\"question.type === 'date'\">\n                  <date-question v-model=\"currentSection.questions[questionIndex]\" :disabled=\"disabled\"></date-question>\n                </span>\n                <span v-if=\"['free_text', 'integer'].indexOf(question.type) >= 0\">\n                  <input-question v-model=\"currentSection.questions[questionIndex]\" :disabled=\"disabled\"></input-question>\n                </span>\n                <span v-if=\"['single_select', 'yes_no'].indexOf(question.type) >= 0\">\n                  <radio-question v-model=\"currentSection.questions[questionIndex]\" :disabled=\"disabled\"></radio-question>\n                </span>\n              </fieldset>\n            </section>\n            <div v-if=\"!disabled\" class=\"control\">\n              <div v-if=\"validationFailed && slotProps.invalid\" class=\"small text-danger mb-4\">\n                <p class=\"pb-2\">Please complete the following questions:</p>\n                <p v-for=\"errorText in filterArray(slotProps.errors)\">{{ errorText }}.</p>\n              </div>\n              <button v-if=\"currentSectionIndex > 0\" class=\"button back\" type=\"button\" @click=\"prevSection\">Back</button>\n              <button class=\"button mt-3\" type=\"button\" @click=\"nextSection\">\n                <span v-if=\"isLastSection\">{{ savingData ? 'Submitting...' : 'Submit' }}</span>\n                <span v-else>{{ savingData ? 'Saving...' : 'Continue' }}</span>\n              </button>\n            </div>\n          </form>\n        </main>\n      </validation-observer>\n    </div>\n  </div>\n</template>\n\n<script>\n  import InputQuestion from './components/Questions/Input.vue'\n  import RadioQuestion from './components/Questions/Radio.vue'\n  import CheckboxQuestion from './components/Questions/Checkbox.vue'\n  import ScaleQuestion from './components/Questions/Scale.vue'\n  import DateQuestion from './components/Questions/Date.vue'\n\n  import { ValidationObserver } from 'vee-validate'\n\n  export default {\n    name: 'Duckform',\n    components: {\n      CheckboxQuestion,\n      DateQuestion,\n      InputQuestion,\n      RadioQuestion,\n      ScaleQuestion,\n      ValidationObserver\n    },\n    data () {\n      return {\n        currentSectionIndex: 0,\n        errorLoading: false,\n        form: this.formData,\n        formDataLoaded: false,\n        formId: null,\n        formSubmitted: false,\n        loadingData: true,\n        savingData: false,\n        submit: this.submitData,\n        submitDataLoaded: false,\n        validationFailed: false,\n      }\n    },\n    props: {\n      formData: {\n        type: Object,\n        default: () => { return { sections: [] } }\n      },\n      formDataEndpoint: {\n        type: String,\n        default: null\n      },\n      disabled: {\n        type: Boolean,\n        default: false\n      },\n      submitData: {\n        type: Object,\n        default: () => { return { sections: [] } }\n      },\n      submitId: {\n        type: [Number, String],\n        default: null\n      },\n    },\n    computed: {\n      currentSection () {\n        return this.form.sections[this.currentSectionIndex]\n      },\n      isLastSection () {\n        return this.currentSectionIndex + 1 >= this.form.sections.length\n      }\n    },\n    mounted () {\n      if (_.isEmpty(this.formDataEndpoint)) {\n        this.proccessFormSections()\n        this.getSubmitAndMerge().then(() => { this.loadingData = false })\n      } else {\n        this.getForm().then(() => {\n          this.getSubmitAndMerge().then(() => { this.loadingData = false })\n        })\n      }\n    },\n    methods: {\n      filterArray(errors) {\n        const errorIndexes = Object.values(errors).map((v, k) => { return v.length ? k : null }).filter((i) => i !== null)\n\n        return Object.keys(errors).filter((v, k) => errorIndexes.indexOf(k) >= 0)\n      },\n      getForm () {\n        return axios.get(this.formDataEndpoint).then(response => {\n          this.form = response.data.data\n          this.proccessFormSections()\n        }).catch(() => {\n          this.errorLoading = true\n        }).finally(() => {\n          this.formDataLoaded = true\n        })\n      },\n      getSubmit () {\n        return axios.get(`${this.formDataEndpoint}/submits/${this.submitId}`).then(response => {\n          this.submit = response.data.data\n          this.formSubmitted = !_.isEmpty(response.data.data.completed_at)\n        }).catch(() => {\n          this.errorLoading = true\n        }).finally(() => {\n          this.submitDataLoaded = true\n        })\n      },\n      getSubmitAndMerge () {\n        if (_.isEmpty(this.submitId)) {\n          this.mergeSubmitData()\n          return new Promise((resolve) => resolve())\n        } else {\n          return this.getSubmit().then(() => this.mergeSubmitData())\n        }\n      },\n      proccessFormSections () {\n        this.form.sections = _.sortBy(this.form.sections, (i) => i.order || 0).map((section) => {\n          section.questions.map((question) => {\n            question.possible_answers = _.sortBy(question.possible_answers, (i) => i.order || 0)\n            this.$set(question, 'possible_answers_selected', [])\n            return question\n          })\n          return section\n        })\n      },\n      mergeSubmitData() {\n        const savedSectionsArranged = _.keyBy(this.submit.sections.map((section) => {\n          section.questions = _.keyBy(section.questions, 'id')\n          return section\n        }), 'slug')\n        const formSectionsArranged = _.keyBy(this.form.sections.map((section) => {\n          section.questions = _.keyBy(section.questions, 'id')\n          return section\n        }), 'slug')\n        this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged))\n      },\n      nextSection () {\n        this.$refs.validationObserver.validate().then(success => {\n          if (!success) {\n            this.validationFailed = true\n            return false\n          }\n\n          this.validationFailed = false\n\n          this.save().then(() => {\n            if (this.currentSectionIndex + 1 < this.form.sections.length) {\n              this.currentSectionIndex++\n              this.$refs.surveyTop.scrollIntoView()\n            }\n          })\n        })\n      },\n      prevSection () {\n        if (this.currentSectionIndex > 0) {\n          this.currentSectionIndex--\n          this.$refs.surveyTop.scrollIntoView()\n        }\n      },\n      save () {\n        this.savingData = true\n        const responseHandler = (response) => {\n          this.submit = response.data.data\n          this.mergeSubmitData()\n\n          if (this.isLastSection) {\n            this.formSubmitted = !_.isEmpty(response.data.data.completed_at)\n          }\n        }\n\n        if (this.submit.token) {\n          return axios.patch(`${this.formDataEndpoint}/submits/${this.submit.token}`, { data: this.form }).then(responseHandler).finally(() => { this.savingData = false })\n        }\n\n        return axios.post(`${this.formDataEndpoint}/submits`, { data: this.form }).then(responseHandler).finally(() => { this.savingData = false })\n      }\n    }\n  }\n</script>\n\n<style lang=\"scss\">\n  .duckform {\n    font-size: 1rem;\n\n    a {\n      transition-duration: .4s\n    }\n\n    fieldset {\n      border-bottom: 1px solid #ccc;\n      border-left: 0;\n      border-right: 0;\n      border-top: 0;\n      padding: 0 0 25px 0;\n      margin: 20px 20px 10px 20px;\n    }\n\n    button {\n      transition-duration: .4s;\n      &:focus { outline: none; }\n      &:not([disabled]) { cursor: pointer; }\n    }\n\n    .button {\n      background-color: #edaca0;\n      border: none;\n      color: #fff;\n      display: inline-block;\n      font-size: 1.4rem;\n      padding: 15px 30px;\n      text-decoration: none;\n      border: 1px solid #fff;\n\n      &[disabled] {\n        background-color: #A5AFA5;\n      }\n      &:not([disabled]):hover {\n        background-color: #fff;\n        color: #000;\n        border: 1px solid #000;\n      }\n      &.orange {\n        background-color: #FF5900;\n      }\n      &.orange:hover {\n        background-color: #004D50;\n      }\n    }\n\n    .statement {\n\n    }\n    .input {\n      label {\n        align-items: flex-start;\n        cursor: pointer;\n        display: flex;\n      }\n      input[type=\"text\"],\n      input[type=\"number\"],\n      input[type=\"date\"] {\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n\n        border-radius: 5px;\n        border: 0;\n        background-color: #8ec0ed30;\n        box-shadow: none;\n        box-sizing: border-box;\n        display: block;\n        padding: 5px 10px;\n        &:focus {\n          outline: none;\n          transition-duration: .4s;\n        }\n      }\n      input.other {\n        display: inline-block;\n      }\n    }\n\n    .header {\n      border-bottom: 1px solid #ddd;\n      text-align: center;\n      width: 100%;\n      @media (min-width: 1000px) {\n        text-align: left;\n      }\n      .center {\n        padding: 0 30px;\n      }\n      img {\n        height: auto;\n        width: 150px;\n        margin: 15px 0;\n      }\n    }\n\n    .content {\n      flex: 1 0 0;\n      padding: 25px 0 25px 0;\n      margin: 0 auto;\n      max-width: 850px;\n    }\n\n    .control {\n      padding: 20px 0;\n      text-align: center;\n\n      button.back {\n        background-color: transparent;\n        border: 1px solid #ccc;\n        color: #ccc;\n        &:hover {\n          background-color: transparent !important;\n          border-color: #000;\n          color: #000;\n        }\n      }\n    }\n\n    .progress {\n      display: flex;\n      margin: 0;\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: 0;\n      z-index: 1;\n      li {\n        flex-grow: 1;\n        font-size: 12px;\n        text-align: center;\n        transition-duration: .4s;\n        border-top: 7px solid #555;\n        opacity: 0.25;\n        &.active {\n          opacity: 1;\n          border-top-color: #0000ff;\n        }\n      }\n    }\n  }\n</style>\n",".duckform {\n  font-size: 1rem;\n}\n.duckform a {\n  transition-duration: 0.4s;\n}\n.duckform fieldset {\n  border-bottom: 1px solid #ccc;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  padding: 0 0 25px 0;\n  margin: 20px 20px 10px 20px;\n}\n.duckform button {\n  transition-duration: 0.4s;\n}\n.duckform button:focus {\n  outline: none;\n}\n.duckform button:not([disabled]) {\n  cursor: pointer;\n}\n.duckform .button {\n  background-color: #edaca0;\n  border: none;\n  color: #fff;\n  display: inline-block;\n  font-size: 1.4rem;\n  padding: 15px 30px;\n  text-decoration: none;\n  border: 1px solid #fff;\n}\n.duckform .button[disabled] {\n  background-color: #A5AFA5;\n}\n.duckform .button:not([disabled]):hover {\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #000;\n}\n.duckform .button.orange {\n  background-color: #FF5900;\n}\n.duckform .button.orange:hover {\n  background-color: #004D50;\n}\n.duckform .input label {\n  align-items: flex-start;\n  cursor: pointer;\n  display: flex;\n}\n.duckform .input input[type=text],\n.duckform .input input[type=number],\n.duckform .input input[type=date] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 5px;\n  border: 0;\n  background-color: #8ec0ed30;\n  box-shadow: none;\n  box-sizing: border-box;\n  display: block;\n  padding: 5px 10px;\n}\n.duckform .input input[type=text]:focus,\n.duckform .input input[type=number]:focus,\n.duckform .input input[type=date]:focus {\n  outline: none;\n  transition-duration: 0.4s;\n}\n.duckform .input input.other {\n  display: inline-block;\n}\n.duckform .header {\n  border-bottom: 1px solid #ddd;\n  text-align: center;\n  width: 100%;\n}\n@media (min-width: 1000px) {\n  .duckform .header {\n    text-align: left;\n  }\n}\n.duckform .header .center {\n  padding: 0 30px;\n}\n.duckform .header img {\n  height: auto;\n  width: 150px;\n  margin: 15px 0;\n}\n.duckform .content {\n  flex: 1 0 0;\n  padding: 25px 0 25px 0;\n  margin: 0 auto;\n  max-width: 850px;\n}\n.duckform .control {\n  padding: 20px 0;\n  text-align: center;\n}\n.duckform .control button.back {\n  background-color: transparent;\n  border: 1px solid #ccc;\n  color: #ccc;\n}\n.duckform .control button.back:hover {\n  background-color: transparent !important;\n  border-color: #000;\n  color: #000;\n}\n.duckform .progress {\n  display: flex;\n  margin: 0;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n.duckform .progress li {\n  flex-grow: 1;\n  font-size: 12px;\n  text-align: center;\n  transition-duration: 0.4s;\n  border-top: 7px solid #555;\n  opacity: 0.25;\n}\n.duckform .progress li.active {\n  opacity: 1;\n  border-top-color: #0000ff;\n}\n\n/*# sourceMappingURL=Duckform.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$5 = undefined;
  /* module identifier */
  var __vue_module_identifier__$5 = undefined;
  /* functional template */
  var __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    createInjector,
    undefined,
    undefined
  );

function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;
    Vue.component('Duckform', __vue_component__$5);
}

var plugin = { install: install };

var GlobalVue = null;

if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}

if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default __vue_component__$5;
export { install };
