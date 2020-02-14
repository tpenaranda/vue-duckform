(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vee-validate/dist/rules'), require('vee-validate'), require('vue-range-slider'), require('vue-range-slider/dist/vue-range-slider.css'), require('vue-date-pick/dist/vueDatePick.css'), require('vue-date-pick'), require('moment'), require('lodash'), require('axios')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vee-validate/dist/rules', 'vee-validate', 'vue-range-slider', 'vue-range-slider/dist/vue-range-slider.css', 'vue-date-pick/dist/vueDatePick.css', 'vue-date-pick', 'moment', 'lodash', 'axios'], factory) :
  (global = global || self, factory(global.Duckform = {}, global.rules, global.veeValidate, global.rangeSlider, null, null, global.datePick, global.moment, global._, global.axios));
}(this, (function (exports, rules, veeValidate, RangeSlider, vueRangeSlider_css, vueDatePick_css, DatePick, moment, _, axios) { 'use strict';

  RangeSlider = RangeSlider && RangeSlider.hasOwnProperty('default') ? RangeSlider['default'] : RangeSlider;
  DatePick = DatePick && DatePick.hasOwnProperty('default') ? DatePick['default'] : DatePick;
  moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

  //

  veeValidate.extend('integer', Object.assign({}, rules.integer,
    {message: 'Field must be an integer.'}));
  veeValidate.extend('required', Object.assign({}, rules.required,
    {message: 'Field is required.'}));

  var script = {
    components: { ValidationProvider: veeValidate.ValidationProvider },
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
      rules: [],
      inputText: null
    }); },
    created: function created () {
      if (this.value.type === 'integer') {
        this.rules.push('integer');
      }

      if (this.value.required) {
        this.rules.push('required');
      }

      if (!this.value.possible_answers_selected[0]) {
        this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }];
      }

      this.inputText = this.value.possible_answers_selected[0].data;
    },
    methods: {
      handleInputChange: function handleInputChange () {
        this.value.possible_answers_selected[0].data = this.inputText;
        this.$emit('input', this.value);
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
        { staticClass: "df-input" },
        [
          _c("validation-provider", {
            attrs: { rules: _vm.rules.join("|"), name: _vm.value.text },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(slotProps) {
                  return [
                    _c("div", { staticClass: "df-row" }, [
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
                        staticClass: "df-w-100",
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
                              staticClass: "df-label df-pl-1",
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
                    _c("p", { staticClass: "df-small df-td df-mb-0" }, [
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

  veeValidate.extend('required', Object.assign({}, rules.required,
    {message: 'Field is required.'}));

  var script$1 = {
    components: { ValidationProvider: veeValidate.ValidationProvider },
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
        this.value.possible_answers_selected = [{id: id, data: null}];
        this.$emit('input', this.value);
      }
    }
  };

  /* script */
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "ul",
      { staticClass: "df-radio df-list-unstyled df-mb-2" },
      [
        _vm._l(_vm.value.possible_answers, function(answer, answerIndex) {
          return _c("li", { key: answer.id }, [
            _c("label", { staticClass: "df-row" }, [
              _c("div", { staticClass: "df-selector df-py-1" }, [
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
                _c("span", { staticClass: "df-marker" })
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "df-pl-2 df-py-1" }, [
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
                  _c("p", { staticClass: "df-td df-small" }, [
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
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
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
      undefined,
      undefined,
      undefined
    );

  //

  veeValidate.extend('required', Object.assign({}, rules.required,
    {message: 'Field is required.'}));

  var script$2 = {
    components: { ValidationProvider: veeValidate.ValidationProvider },
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
        this.value.possible_answers_selected = this.value.possible_answers_selected.filter(function (i) { return i.id !== id; }).concat({ id: id, data: data });
      },
      handleInputChange: function handleInputChange (id, data) {
        if ( data === void 0 ) data = null;

        if (this.isSelected(id)) {

          var answer = this.value.possible_answers.find(function (i) { return i.id === id; });

          if (answer && answer.text.toLowerCase() === 'other') {
            this.otherText = null;
          }

          this.value.possible_answers_selected = this.value.possible_answers_selected.filter(function (o) { return o.id !== id; });
        } else {
          this.value.possible_answers_selected = this.value.possible_answers_selected.concat({ id: id, data: data });
        }

        this.$emit('input', this.value);
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
      { staticClass: "df-checkbox df-list-unstyled" },
      [
        _vm._l(_vm.value.possible_answers, function(answer, answerIndex) {
          return _c("li", { key: answer.id }, [
            _c("label", { staticClass: "df-row" }, [
              _c("div", { staticClass: "df-selector df-py-1" }, [
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
                ? _c("span", { staticClass: "df-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.otherText,
                          expression: "otherText"
                        }
                      ],
                      staticClass: "df-ml-2",
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
                : _c("span", { staticClass: "df-label df-pl-2 df-py-1" }, [
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
                  _c("p", { staticClass: "df-small df-td" }, [
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
                  _c("p", { staticClass: "df-small df-td" }, [
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
      return _c("span", { staticClass: "df-marker" }, [
        _c("img", {
          staticClass: "df-icon",
          attrs: { src: img }
        })
      ])
    }
  ];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
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
      undefined,
      undefined,
      undefined
    );

  //

  veeValidate.extend('required', Object.assign({}, rules.required,
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
      ValidationProvider: veeValidate.ValidationProvider
    },
    computed: {
      selectedId: {
        get: function get () {
          var this$1 = this;

          return this.value.possible_answers.findIndex(function (item) { return item.id === this$1.value.possible_answers_selected[0].id; }) + 1
        },
        set: function set (val) {
          this.value.possible_answers_selected = [{ id: this.value.possible_answers[val - 1].id, data: true }];
          this.$emit('input', this.value);
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
      { staticClass: "df-scale" },
      [
        _c("range-slider", {
          attrs: {
            disabled: _vm.disabled,
            max: _vm.value.possible_answers.length,
            min: "1",
            step: "1"
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
        _c("div", { staticClass: "df-selection" }, [
          _c("div", { staticClass: "df-w-25 df-small df-tl" }, [
            _vm._v(_vm._s(_vm.value.possible_answers[0].text))
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "df-w-50 df-tc" }, [
            _vm._v(_vm._s(_vm.selectedId))
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "df-w-25 df-small df-tr" }, [
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
                  _c("p", { staticClass: "df-td df-small" }, [
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
    var __vue_inject_styles__$3 = undefined;
    /* scoped */
    var __vue_scope_id__$3 = undefined;
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject */
    
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
      undefined,
      undefined,
      undefined
    );

  //

  veeValidate.extend('regex', Object.assign({}, rules.regex,
    {message: "Field must match the 'MM-DD-YYYY' pattern."}));

  veeValidate.extend('required', Object.assign({}, rules.required,
    {message: 'Field is required.'}));

  var script$4 = {
    components: {
      DatePick: DatePick,
      ValidationProvider: veeValidate.ValidationProvider
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
        this.$emit('input', this.value);
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
      { staticClass: "df-date" },
      [
        _c("validation-provider", {
          ref: "validationProvider",
          attrs: {
            rules: { required: _vm.value.required, regex: /^\d{2}-\d{2}-\d{4}$/ },
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
                  _c("p", { staticClass: "df-small df-td" }, [
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
    var __vue_inject_styles__$4 = undefined;
    /* scoped */
    var __vue_scope_id__$4 = undefined;
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* style inject */
    
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
      undefined,
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
      ValidationObserver: veeValidate.ValidationObserver
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
        default: function () { return {} }
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
        default: function () { return {} }
      },
      submitId: {
        type: [Number, String],
        default: null
      },
      value: {
        type: Object,
        default: function () { return {} }
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
      handleQuestionInput: function handleQuestionInput (question) {
        this.$emit('input', this.form);
      },
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
          if (section.questions) {
            section.questions.map(function (question) {
              question.possible_answers = _.sortBy(question.possible_answers, function (i) { return i.order || 0; });
              this$1.$set(question, 'possible_answers_selected', []);
              return question
            });
          }
          return section
        });
      },
      mergeSubmitData: function mergeSubmitData() {
        if (!this.submit.sections || !this.submit.sections.length) {
          return null
        }
        var savedSectionsArranged = _.keyBy(this.submit.sections.map(function (section) {
          section.questions = _.keyBy(section.questions, 'id');
          return section
        }), 'slug');
        var formSectionsArranged = _.keyBy(this.form.sections.map(function (section) {
          section.questions = _.keyBy(section.questions, 'id');
          return section
        }), 'slug');
        this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged)).map(function (section) {
          section.questions = _.values(section.questions);
          return section
        });
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
            }
          }).finally(function () {
            this$1.$emit('save', this$1.form);
          });
        });
      },
      prevSection: function prevSection () {
        if (this.currentSectionIndex > 0) {
          this.currentSectionIndex--;
        }
      },
      saveToApi: function saveToApi () {
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
          return axios.patch(((this.formDataEndpoint) + "/submits/" + (this.submit.token)), { data: this.form }).then(responseHandler).finally(function () {
            this$1.savingData = false;
          })
        }

        return axios.post(((this.formDataEndpoint) + "/submits"), { data: this.form }).then(responseHandler).finally(function () {
          this$1.savingData = false;
        })
      },
      save: function save () {
        if (!_.isEmpty(this.formDataEndpoint)) {
          return this.saveToApi()
        }

        if (this.isLastSection) {
          this.form.completed_at = moment().toISOString();
          this.formSubmitted = true;
        }

        return new Promise(function (resolve) { return resolve(); })
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
                  _c("p", { staticClass: "df-title df-tc" }, [
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
                  _c("p", { staticClass: "df-title df-tc" }, [
                    _vm._v("Ups, there was an error loading the form.")
                  ])
                ],
                { form: _vm.form }
              )
            ],
            2
          )
        : !_vm.form.sections || !_vm.form.sections.length
        ? _c("div", [
            _c("p", { staticClass: "df-title df-tc" }, [
              _vm._v("There are no sections defined on this form.")
            ])
          ])
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
                            { staticClass: "df-content" },
                            [
                              _vm.formSubmitted
                                ? _vm._t(
                                    "completed",
                                    [
                                      _c("p", { staticClass: "df-title df-tc" }, [
                                        _vm._v("Thanks!")
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "p",
                                        { staticClass: "df-subtitle df-tc" },
                                        [_vm._v("Form is completed.")]
                                      )
                                    ],
                                    { form: _vm.form }
                                  )
                                : _c("form", [
                                    _vm.form.title
                                      ? _c(
                                          "p",
                                          { staticClass: "df-title df-tc" },
                                          [_vm._v(_vm._s(_vm.form.title))]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    !_vm.disabled
                                      ? _c(
                                          "ul",
                                          {
                                            staticClass:
                                              "df-progress df-list-unstyled"
                                          },
                                          _vm._l(_vm.form.sections, function(
                                            section,
                                            index
                                          ) {
                                            return _c("li", {
                                              class: {
                                                "df-active":
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
                                        "p",
                                        {
                                          staticClass: "df-subtitle df-tc df-pb-4"
                                        },
                                        [_vm._v(_vm._s(_vm.currentSection.title))]
                                      ),
                                      _vm._v(" "),
                                      _vm.currentSection.description
                                        ? _c(
                                            "p",
                                            {
                                              staticClass:
                                                "df-section-description"
                                            },
                                            [
                                              _c("strong", [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.currentSection.description
                                                  )
                                                )
                                              ])
                                            ]
                                          )
                                        : _vm._e()
                                    ]),
                                    _vm._v(" "),
                                    _vm.currentSection.questions &&
                                    _vm.currentSection.questions.length
                                      ? _c(
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
                                                      { staticClass: "df-pb-1" },
                                                      [
                                                        _vm._v(
                                                          _vm._s(question.text)
                                                        ),
                                                        question.required
                                                          ? _c(
                                                              "span",
                                                              {
                                                                staticClass:
                                                                  "df-td df-small"
                                                              },
                                                              [_vm._v(" *")]
                                                            )
                                                          : _vm._e()
                                                      ]
                                                    )
                                                  ]),
                                                  _vm._v(" "),
                                                  question.type === "multiselect"
                                                    ? _c("checkbox-question", {
                                                        attrs: {
                                                          disabled: _vm.disabled
                                                        },
                                                        on: {
                                                          input:
                                                            _vm.handleQuestionInput
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
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  question.type === "scale"
                                                    ? _c("scale-question", {
                                                        attrs: {
                                                          disabled: _vm.disabled
                                                        },
                                                        on: {
                                                          input:
                                                            _vm.handleQuestionInput
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
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  question.type === "date"
                                                    ? _c("date-question", {
                                                        attrs: {
                                                          disabled: _vm.disabled
                                                        },
                                                        on: {
                                                          input:
                                                            _vm.handleQuestionInput
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
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  [
                                                    "free_text",
                                                    "integer"
                                                  ].indexOf(question.type) >= 0
                                                    ? _c("input-question", {
                                                        attrs: {
                                                          disabled: _vm.disabled
                                                        },
                                                        on: {
                                                          input:
                                                            _vm.handleQuestionInput
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
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  [
                                                    "single_select",
                                                    "yes_no"
                                                  ].indexOf(question.type) >= 0
                                                    ? _c("radio-question", {
                                                        attrs: {
                                                          disabled: _vm.disabled
                                                        },
                                                        on: {
                                                          input:
                                                            _vm.handleQuestionInput
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
                                                    : _vm._e()
                                                ],
                                                1
                                              )
                                            }
                                          ),
                                          0
                                        )
                                      : _c("div", [
                                          _c("p", { staticClass: "df-tc" }, [
                                            _c("strong", [
                                              _vm._v(
                                                "No questions defined on this section."
                                              )
                                            ])
                                          ])
                                        ]),
                                    _vm._v(" "),
                                    !_vm.disabled
                                      ? _c("div", { staticClass: "df-control" }, [
                                          _vm.validationFailed &&
                                          slotProps.invalid
                                            ? _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "df-small df-td df-mb-4"
                                                },
                                                [
                                                  _c("p", [
                                                    _vm._v(
                                                      "Please complete the following questions:"
                                                    )
                                                  ]),
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
                                                  staticClass:
                                                    "df-button df-back",
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
                                              staticClass: "df-button df-mt-3",
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
      inject("data-v-b8534cc0_0", { source: ".duckform {\n  font-size: 1rem;\n  text-align: left;\n}\n.duckform a {\n  transition-duration: 0.4s;\n}\n.duckform fieldset {\n  border-bottom: 1px solid #ccc;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  padding: 25px 0;\n  margin: 0 20px;\n}\n.duckform button {\n  transition-duration: 0.4s;\n}\n.duckform button:focus {\n  outline: none;\n}\n.duckform button:not([disabled]) {\n  cursor: pointer;\n}\n.duckform label {\n  display: block;\n  margin-bottom: 0;\n}\n.duckform p {\n  margin: 3px 0;\n}\n.duckform header p.df-section-description {\n  margin-left: 20px;\n}\n.duckform ul {\n  margin-bottom: 0;\n}\n.duckform .df-title {\n  font-size: 1.75rem;\n}\n.duckform .df-subtitle {\n  font-size: 1.25rem;\n}\n.duckform .df-row {\n  display: flex;\n}\n.duckform .df-tc {\n  text-align: center !important;\n}\n.duckform .df-tr {\n  text-align: right !important;\n}\n.duckform .df-tl {\n  text-align: left !important;\n}\n.duckform .df-td {\n  color: #dc3545 !important;\n}\n.duckform .df-list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.duckform .df-small {\n  font-size: 0.75em;\n}\n.duckform .df-w-25 {\n  width: 25% !important;\n}\n.duckform .df-w-50 {\n  width: 50% !important;\n}\n.duckform .df-w-100 {\n  width: 100% !important;\n}\n.duckform .df-py-1 {\n  padding-top: 0.25em !important;\n}\n.duckform .df-pb-1, .duckform .df-py-1 {\n  padding-bottom: 0.25em !important;\n}\n.duckform .df-pb-2 {\n  padding-bottom: 0.5em !important;\n}\n.duckform .df-pb-3 {\n  padding-bottom: 0.75em !important;\n}\n.duckform .df-pb-4 {\n  padding-bottom: 1em !important;\n}\n.duckform .df-pl-1 {\n  padding-left: 0.25em !important;\n}\n.duckform .df-pl-2 {\n  padding-left: 0.5em !important;\n}\n.duckform .df-mt-3 {\n  margin-top: 0.75em !important;\n}\n.duckform .df-mb-0 {\n  margin-bottom: 0 !important;\n}\n.duckform .df-mb-2 {\n  margin-bottom: 0.5em !important;\n}\n.duckform .df-mb-4 {\n  margin-bottom: 1em !important;\n}\n.duckform .df-ml-2 {\n  margin-left: 0.5em !important;\n}\n.duckform .df-button {\n  background-color: #8ec0ed;\n  border: none;\n  color: #fff;\n  display: inline-block;\n  font-size: 1.4rem;\n  padding: 15px 30px;\n  text-decoration: none;\n  border: 1px solid #fff;\n}\n.duckform .df-button[disabled] {\n  background-color: #dbebf9;\n}\n.duckform .df-button:not([disabled]):hover {\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #000;\n}\n.duckform .df-input label, .duckform .df-date label {\n  align-items: flex-start;\n  cursor: pointer;\n  display: flex;\n}\n.duckform .df-input input[type=text],\n.duckform .df-input input[type=number],\n.duckform .df-input input[type=date], .duckform .df-date input[type=text],\n.duckform .df-date input[type=number],\n.duckform .df-date input[type=date] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 5px;\n  border: 0;\n  background-color: #8ec0ed30;\n  box-shadow: none;\n  box-sizing: border-box;\n  display: block;\n  padding: 5px 10px;\n}\n.duckform .df-input input[type=text]:focus,\n.duckform .df-input input[type=number]:focus,\n.duckform .df-input input[type=date]:focus, .duckform .df-date input[type=text]:focus,\n.duckform .df-date input[type=number]:focus,\n.duckform .df-date input[type=date]:focus {\n  outline: none;\n  transition-duration: 0.4s;\n}\n.duckform .df-input input.other, .duckform .df-date input.other {\n  display: inline-block;\n}\n.duckform .df-content {\n  flex: 1 0 0;\n  padding: 25px 0 25px 0;\n  margin: 0 auto;\n}\n.duckform .df-control {\n  padding: 20px 0;\n  text-align: center;\n}\n.duckform .df-control button.back {\n  background-color: transparent;\n  border: 1px solid #ccc;\n  color: #ccc;\n}\n.duckform .df-control button.back:hover {\n  background-color: transparent !important;\n  border-color: #000;\n  color: #000;\n}\n.duckform .df-progress {\n  display: flex;\n  margin: 0;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n.duckform .df-progress li {\n  flex-grow: 1;\n  font-size: 12px;\n  text-align: center;\n  transition-duration: 0.4s;\n  border-top: 7px solid #555;\n  opacity: 0.25;\n}\n.duckform .df-progress li.df-active {\n  opacity: 1;\n  border-top-color: #0055ff;\n}\n.duckform .df-scale .df-selection {\n  display: flex;\n}\n.duckform .df-scale .range-slider-inner {\n  min-width: 80px;\n}\n.duckform .df-scale .range-slider {\n  box-sizing: border-box;\n  display: block;\n  height: 40px;\n  margin-bottom: 10px;\n  width: 100%;\n}\n.duckform .df-scale .range-slider .range-slider-knob {\n  background-color: #8ec0ed;\n  border: none;\n  height: 25px;\n  width: 25px;\n}\n.duckform .df-scale .range-slider input[type=text] {\n  background: transparent;\n  border: none;\n  color: #004D50;\n  cursor: default;\n  font-size: 1rem;\n  padding-top: 40px;\n  text-align: center;\n  user-select: none;\n}\n.duckform .df-scale .range-slider .range-slider-fill {\n  background-color: #8ec0ed30;\n  border-radius: 25px;\n  height: 25px;\n}\n.duckform .df-scale .range-slider .range-slider-rail {\n  background-color: #e7e9e730;\n  border-radius: 25px;\n  height: 25px;\n}\n.duckform .vdpClearInput {\n  display: none;\n}\n.duckform .vdpCellContent {\n  font-size: 13px;\n}\n.duckform .vdpComponent {\n  width: 100%;\n}\n.duckform .vdpComponent input {\n  font-size: 16px;\n  width: 100%;\n}\n.duckform .df-radio .df-selector {\n  display: inline-block;\n}\n.duckform .df-radio .df-selector input {\n  display: none;\n}\n.duckform .df-radio .df-selector .df-marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.duckform .df-radio .df-selector input:checked ~ .df-marker {\n  background-color: #8ec0ed;\n  border-color: #8ec0ed;\n}\n.duckform .df-radio .df-selector label:hover .df-marker {\n  border-color: #adc0c4;\n}\n.duckform .df-checkbox .df-selector {\n  display: inline-block;\n}\n.duckform .df-checkbox .df-selector input[type=checkbox],\n.duckform .df-checkbox .df-selector input[type=radio] {\n  display: none;\n}\n.duckform .df-checkbox .df-selector .df-marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.duckform .df-checkbox .df-selector .df-icon {\n  position: absolute;\n  top: -25px;\n  left: -12px;\n  transform: scale(0);\n  transition-duration: 0.4s;\n}\n.duckform .df-checkbox .df-selector input:checked ~ .df-marker {\n  border-color: #8ec0ed;\n}\n.duckform .df-checkbox .df-selector input:checked ~ .df-marker .df-icon {\n  transform: scale(0.5);\n}\n.duckform .df-checkbox .df-selector input[type=radio]:checked ~ .df-marker {\n  background-color: #8ec0ed;\n}\n.duckform .df-checkbox .df-selector .df-label {\n  padding: 0 0 0 10px;\n}\n.duckform .df-checkbox .df-selector label:hover .df-marker {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Duckform.vue.map */", map: {"version":3,"sources":["/home/tate/vue-duckform/src/Duckform.vue","Duckform.vue"],"names":[],"mappings":"AAoSA;EACA,eAAA;EACA,gBAAA;ACnSA;ADqSA;EACA,yBAAA;ACnSA;ADsSA;EACA,6BAAA;EACA,cAAA;EACA,eAAA;EACA,aAAA;EACA,eAAA;EACA,cAAA;ACpSA;ADuSA;EACA,yBAAA;ACrSA;ADsSA;EAAA,aAAA;ACnSA;ADoSA;EAAA,eAAA;ACjSA;ADoSA;EACA,cAAA;EACA,gBAAA;AClSA;ADqSA;EACA,aAAA;ACnSA;ADsSA;EACA,iBAAA;ACpSA;ADuSA;EACA,gBAAA;ACrSA;ADwSA;EACA,kBAAA;ACtSA;ADySA;EACA,kBAAA;ACvSA;AD0SA;EACA,aAAA;ACxSA;AD2SA;EACA,6BAAA;ACzSA;AD4SA;EACA,4BAAA;AC1SA;AD6SA;EACA,2BAAA;AC3SA;AD8SA;EACA,yBAAA;AC5SA;AD+SA;EACA,eAAA;EACA,gBAAA;AC7SA;ADgTA;EACA,iBAAA;AC9SA;ADiTA;EACA,qBAAA;AC/SA;ADkTA;EACA,qBAAA;AChTA;ADmTA;EACA,sBAAA;ACjTA;ADoTA;EACA,8BAAA;AClTA;ADqTA;EACA,iCAAA;ACnTA;ADsTA;EACA,gCAAA;ACpTA;ADuTA;EACA,iCAAA;ACrTA;ADwTA;EACA,8BAAA;ACtTA;ADyTA;EACA,+BAAA;ACvTA;AD0TA;EACA,8BAAA;ACxTA;AD2TA;EACA,6BAAA;ACzTA;AD4TA;EACA,2BAAA;AC1TA;AD6TA;EACA,+BAAA;AC3TA;AD6TA;EACA,6BAAA;AC3TA;AD8TA;EACA,6BAAA;AC5TA;AD+TA;EACA,yBAAA;EACA,YAAA;EACA,WAAA;EACA,qBAAA;EACA,iBAAA;EACA,kBAAA;EACA,qBAAA;EACA,sBAAA;AC7TA;AD+TA;EACA,yBAAA;AC7TA;AD+TA;EACA,sBAAA;EACA,WAAA;EACA,sBAAA;AC7TA;ADkUA;EACA,uBAAA;EACA,eAAA;EACA,aAAA;AChUA;ADkUA;;;;;EAGA,wBAAA;EACA,qBAAA;EACA,gBAAA;EAEA,kBAAA;EACA,SAAA;EACA,2BAAA;EACA,gBAAA;EACA,sBAAA;EACA,cAAA;EACA,iBAAA;AC/TA;ADgUA;;;;;EACA,aAAA;EACA,yBAAA;AC1TA;AD6TA;EACA,qBAAA;AC3TA;AD+TA;EACA,WAAA;EACA,sBAAA;EACA,cAAA;AC7TA;ADgUA;EACA,eAAA;EACA,kBAAA;AC9TA;ADgUA;EACA,6BAAA;EACA,sBAAA;EACA,WAAA;AC9TA;AD+TA;EACA,wCAAA;EACA,kBAAA;EACA,WAAA;AC7TA;ADkUA;EACA,aAAA;EACA,SAAA;EACA,eAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,UAAA;AChUA;ADiUA;EACA,YAAA;EACA,eAAA;EACA,kBAAA;EACA,yBAAA;EACA,0BAAA;EACA,aAAA;AC/TA;ADgUA;EACA,UAAA;EACA,yBAAA;AC9TA;ADoUA;EACA,aAAA;AClUA;ADoUA;EACA,eAAA;AClUA;ADoUA;EACA,sBAAA;EACA,cAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;AClUA;ADoUA;EACA,yBAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;AClUA;ADqUA;EACA,uBAAA;EACA,YAAA;EACA,cAAA;EACA,eAAA;EACA,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,iBAAA;ACnUA;ADqUA;EACA,2BAAA;EACA,mBAAA;EACA,YAAA;ACnUA;ADqUA;EACA,2BAAA;EACA,mBAAA;EACA,YAAA;ACnUA;ADwUA;EACA,aAAA;ACtUA;ADwUA;EACA,eAAA;ACtUA;ADwUA;EACA,WAAA;ACtUA;ADwUA;EACA,eAAA;EACA,WAAA;ACtUA;AD6UA;EACA,qBAAA;AC3UA;AD6UA;EACA,aAAA;AC3UA;AD8UA;EACA,mBAAA;EACA,mBAXA;EAYA,2BAAA;EACA,aAAA;EACA,YAdA;EAeA,uBAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAlBA;AC1TA;AD8UA;EACA,yBAAA;EACA,qBAAA;AC5UA;AD+UA;EACA,qBAAA;AC7UA;ADsVA;EACA,qBAAA;ACpVA;ADqVA;;EAEA,aAAA;ACnVA;ADqVA;EACA,mBAAA;EACA,mBAVA;EAWA,2BAAA;EACA,aAAA;EACA,YAbA;EAcA,uBAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAjBA;AClUA;ADqVA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;EACA,mBAAA;EACA,yBAAA;ACnVA;ADqVA;EACA,qBAAA;ACnVA;ADoVA;EACA,qBAAA;AClVA;ADqVA;EACA,yBAAA;ACnVA;ADsVA;EACA,mBAAA;ACpVA;ADwVA;EACA,qBAAA;ACtVA;;AAEA,uCAAuC","file":"Duckform.vue","sourcesContent":["<template>\n  <div class=\"duckform\">\n    <div v-if=\"loadingData\">\n      <slot name=\"loading\" v-bind:form=\"form\">\n        <p class=\"df-title df-tc\">{{ form.title || 'Loading...' }}</p>\n      </slot>\n    </div>\n    <div v-else-if=\"errorLoading\">\n      <slot name=\"errorLoading\" v-bind:form=\"form\">\n        <p class=\"df-title df-tc\">Ups, there was an error loading the form.</p>\n      </slot>\n    </div>\n    <div v-else-if=\"!form.sections || !form.sections.length\">\n      <p class=\"df-title df-tc\">There are no sections defined on this form.</p>\n    </div>\n    <div v-else>\n      <validation-observer ref=\"validationObserver\" v-slot=\"slotProps\">\n        <main class=\"df-content\">\n          <slot name=\"completed\" v-if=\"formSubmitted\" v-bind:form=\"form\">\n            <p class=\"df-title df-tc\">Thanks!</p>\n            <p class=\"df-subtitle df-tc\">Form is completed.</p>\n          </slot>\n          <form v-else>\n            <p v-if=\"form.title\" class=\"df-title df-tc\">{{ form.title }}</p>\n            <ul v-if=\"!disabled\" class=\"df-progress df-list-unstyled\">\n              <li v-for=\"(section, index) in form.sections\" :class=\"{'df-active': index <= currentSectionIndex}\"></li>\n            </ul>\n            <header>\n              <p class=\"df-subtitle df-tc df-pb-4\">{{ currentSection.title }}</p>\n              <p class=\"df-section-description\" v-if=\"currentSection.description\"><strong>{{ currentSection.description }}</strong></p>\n            </header>\n            <section v-if=\"currentSection.questions && currentSection.questions.length\">\n              <fieldset v-for=\"(question, questionIndex) in currentSection.questions\" :key=\"`S${currentSectionIndex}|Q${questionIndex}`\">\n                <header>\n                  <div class=\"df-pb-1\">{{ question.text }}<span v-if=\"question.required\" class=\"df-td df-small\"> *</span></div>\n                </header>\n                <checkbox-question v-if=\"question.type === 'multiselect'\"\n                  v-model=\"currentSection.questions[questionIndex]\"\n                  :disabled=\"disabled\"\n                  @input=\"handleQuestionInput\">\n                </checkbox-question>\n                <scale-question v-if=\"question.type === 'scale'\"\n                  v-model=\"currentSection.questions[questionIndex]\"\n                  :disabled=\"disabled\"\n                  @input=\"handleQuestionInput\">\n                </scale-question>\n                <date-question v-if=\"question.type === 'date'\"\n                  v-model=\"currentSection.questions[questionIndex]\"\n                  :disabled=\"disabled\"\n                  @input=\"handleQuestionInput\">\n                </date-question>\n                <input-question v-if=\"['free_text', 'integer'].indexOf(question.type) >= 0\"\n                  v-model=\"currentSection.questions[questionIndex]\"\n                  :disabled=\"disabled\"\n                  @input=\"handleQuestionInput\">\n                </input-question>\n                <radio-question v-if=\"['single_select', 'yes_no'].indexOf(question.type) >= 0\"\n                  v-model=\"currentSection.questions[questionIndex]\"\n                  :disabled=\"disabled\"\n                  @input=\"handleQuestionInput\">\n                </radio-question>\n              </fieldset>\n            </section>\n            <div v-else>\n              <p class=\"df-tc\"><strong>No questions defined on this section.</strong></p>\n            </div>\n            <div v-if=\"!disabled\" class=\"df-control\">\n              <div v-if=\"validationFailed && slotProps.invalid\" class=\"df-small df-td df-mb-4\">\n                <p>Please complete the following questions:</p>\n                <p v-for=\"errorText in filterArray(slotProps.errors)\">{{ errorText }}.</p>\n              </div>\n              <button v-if=\"currentSectionIndex > 0\" class=\"df-button df-back\" type=\"button\" @click=\"prevSection\">Back</button>\n              <button class=\"df-button df-mt-3\" type=\"button\" @click=\"nextSection\">\n                <span v-if=\"isLastSection\">{{ savingData ? 'Submitting...' : 'Submit' }}</span>\n                <span v-else>{{ savingData ? 'Saving...' : 'Continue' }}</span>\n              </button>\n            </div>\n          </form>\n        </main>\n      </validation-observer>\n    </div>\n  </div>\n</template>\n\n<script>\n  import InputQuestion from './components/Questions/Input.vue'\n  import RadioQuestion from './components/Questions/Radio.vue'\n  import CheckboxQuestion from './components/Questions/Checkbox.vue'\n  import ScaleQuestion from './components/Questions/Scale.vue'\n  import DateQuestion from './components/Questions/Date.vue'\n\n  import _ from 'lodash'\n  import axios from 'axios'\n  import moment from 'moment';\n  import { ValidationObserver } from 'vee-validate'\n\n  export default {\n    name: 'Duckform',\n    components: {\n      CheckboxQuestion,\n      DateQuestion,\n      InputQuestion,\n      RadioQuestion,\n      ScaleQuestion,\n      ValidationObserver\n    },\n    data () {\n      return {\n        currentSectionIndex: 0,\n        errorLoading: false,\n        form: this.formData,\n        formDataLoaded: false,\n        formId: null,\n        formSubmitted: false,\n        loadingData: true,\n        savingData: false,\n        submit: this.submitData,\n        submitDataLoaded: false,\n        validationFailed: false,\n      }\n    },\n    props: {\n      formData: {\n        type: Object,\n        default: () => { return {} }\n      },\n      formDataEndpoint: {\n        type: String,\n        default: null\n      },\n      disabled: {\n        type: Boolean,\n        default: false\n      },\n      submitData: {\n        type: Object,\n        default: () => { return {} }\n      },\n      submitId: {\n        type: [Number, String],\n        default: null\n      },\n      value: {\n        type: Object,\n        default: () => { return {} }\n      },\n    },\n    computed: {\n      currentSection () {\n        return this.form.sections[this.currentSectionIndex]\n      },\n      isLastSection () {\n        return this.currentSectionIndex + 1 >= this.form.sections.length\n      }\n    },\n    mounted () {\n      if (_.isEmpty(this.formDataEndpoint)) {\n        this.proccessFormSections()\n        this.getSubmitAndMerge().then(() => { this.loadingData = false })\n      } else {\n        this.getForm().then(() => {\n          this.getSubmitAndMerge().then(() => { this.loadingData = false })\n        })\n      }\n    },\n    methods: {\n      handleQuestionInput (question) {\n        this.$emit('input', this.form)\n      },\n      filterArray(errors) {\n        const errorIndexes = Object.values(errors).map((v, k) => { return v.length ? k : null }).filter((i) => i !== null)\n\n        return Object.keys(errors).filter((v, k) => errorIndexes.indexOf(k) >= 0)\n      },\n      getForm () {\n        return axios.get(this.formDataEndpoint).then(response => {\n          this.form = response.data.data\n          this.proccessFormSections()\n        }).catch(() => {\n          this.errorLoading = true\n        }).finally(() => {\n          this.formDataLoaded = true\n        })\n      },\n      getSubmit () {\n        return axios.get(`${this.formDataEndpoint}/submits/${this.submitId}`).then(response => {\n          this.submit = response.data.data\n          this.formSubmitted = !_.isEmpty(response.data.data.completed_at)\n        }).catch(() => {\n          this.errorLoading = true\n        }).finally(() => {\n          this.submitDataLoaded = true\n        })\n      },\n      getSubmitAndMerge () {\n        if (_.isEmpty(this.submitId)) {\n          this.mergeSubmitData()\n          return new Promise((resolve) => resolve())\n        } else {\n          return this.getSubmit().then(() => this.mergeSubmitData())\n        }\n      },\n      proccessFormSections () {\n        this.form.sections = _.sortBy(this.form.sections, (i) => i.order || 0).map((section) => {\n          if (section.questions) {\n            section.questions.map((question) => {\n              question.possible_answers = _.sortBy(question.possible_answers, (i) => i.order || 0)\n              this.$set(question, 'possible_answers_selected', [])\n              return question\n            })\n          }\n          return section\n        })\n      },\n      mergeSubmitData() {\n        if (!this.submit.sections || !this.submit.sections.length) {\n          return null\n        }\n        const savedSectionsArranged = _.keyBy(this.submit.sections.map((section) => {\n          section.questions = _.keyBy(section.questions, 'id')\n          return section\n        }), 'slug')\n        const formSectionsArranged = _.keyBy(this.form.sections.map((section) => {\n          section.questions = _.keyBy(section.questions, 'id')\n          return section\n        }), 'slug')\n        this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged)).map((section) => {\n          section.questions = _.values(section.questions)\n          return section\n        })\n      },\n      nextSection () {\n        this.$refs.validationObserver.validate().then(success => {\n          if (!success) {\n            this.validationFailed = true\n            return false\n          }\n\n          this.validationFailed = false\n\n          this.save().then(() => {\n            if (this.currentSectionIndex + 1 < this.form.sections.length) {\n              this.currentSectionIndex++\n            }\n          }).finally(() => {\n            this.$emit('save', this.form)\n          })\n        })\n      },\n      prevSection () {\n        if (this.currentSectionIndex > 0) {\n          this.currentSectionIndex--\n        }\n      },\n      saveToApi () {\n        this.savingData = true\n        const responseHandler = (response) => {\n          this.submit = response.data.data\n          this.mergeSubmitData()\n\n          if (this.isLastSection) {\n            this.formSubmitted = !_.isEmpty(response.data.data.completed_at)\n          }\n        }\n\n        if (this.submit.token) {\n          return axios.patch(`${this.formDataEndpoint}/submits/${this.submit.token}`, { data: this.form }).then(responseHandler).finally(() => {\n            this.savingData = false\n          })\n        }\n\n        return axios.post(`${this.formDataEndpoint}/submits`, { data: this.form }).then(responseHandler).finally(() => {\n          this.savingData = false\n        })\n      },\n      save () {\n        if (!_.isEmpty(this.formDataEndpoint)) {\n          return this.saveToApi()\n        }\n\n        if (this.isLastSection) {\n          this.form.completed_at = moment().toISOString()\n          this.formSubmitted = true\n        }\n\n        return new Promise((resolve) => resolve())\n      }\n    }\n  }\n</script>\n\n<style lang=\"scss\">\n  .duckform {\n    font-size: 1rem;\n    text-align: left;\n\n    a {\n      transition-duration: .4s\n    }\n\n    fieldset {\n      border-bottom: 1px solid #ccc;\n      border-left: 0;\n      border-right: 0;\n      border-top: 0;\n      padding: 25px 0;\n      margin: 0 20px;\n    }\n\n    button {\n      transition-duration: .4s;\n      &:focus { outline: none; }\n      &:not([disabled]) { cursor: pointer; }\n    }\n\n    label {\n      display: block;\n      margin-bottom: 0;\n    }\n\n    p {\n        margin: 3px 0;\n    }\n\n    header p.df-section-description {\n      margin-left: 20px;\n    }\n\n    ul {\n      margin-bottom: 0;\n    }\n\n    .df-title {\n      font-size: 1.75rem;\n    }\n\n    .df-subtitle {\n      font-size: 1.25rem;\n    }\n\n    .df-row {\n        display: flex;\n    }\n\n    .df-tc {\n      text-align: center !important;\n    }\n\n    .df-tr {\n      text-align: right !important;\n    }\n\n    .df-tl {\n      text-align: left !important;\n    }\n\n    .df-td {\n      color: #dc3545 !important;\n    }\n\n    .df-list-unstyled {\n      padding-left: 0;\n      list-style: none;\n    }\n\n    .df-small {\n      font-size: .75em;\n    }\n\n    .df-w-25 {\n      width: 25% !important;\n    }\n\n    .df-w-50 {\n      width: 50% !important;\n    }\n\n    .df-w-100 {\n      width: 100% !important;\n    }\n\n    .df-py-1 {\n        padding-top: .25em !important;\n    }\n\n    .df-pb-1, .df-py-1 {\n        padding-bottom: .25em !important;\n    }\n\n    .df-pb-2 {\n        padding-bottom: .5em !important;\n    }\n\n    .df-pb-3 {\n        padding-bottom: .75em !important;\n    }\n\n    .df-pb-4 {\n        padding-bottom: 1em !important;\n    }\n\n    .df-pl-1 {\n        padding-left: .25em !important;\n    }\n\n    .df-pl-2 {\n        padding-left: .5em !important;\n    }\n\n    .df-mt-3 {\n        margin-top: .75em !important;\n    }\n\n    .df-mb-0 {\n        margin-bottom: 0 !important;\n    }\n\n    .df-mb-2 {\n        margin-bottom: .5em !important;\n    }\n    .df-mb-4 {\n        margin-bottom: 1em !important;\n    }\n\n    .df-ml-2 {\n        margin-left: .5em !important;\n    }\n\n    .df-button {\n      background-color: #8ec0ed;\n      border: none;\n      color: #fff;\n      display: inline-block;\n      font-size: 1.4rem;\n      padding: 15px 30px;\n      text-decoration: none;\n      border: 1px solid #fff;\n\n      &[disabled] {\n        background-color: #dbebf9;\n      }\n      &:not([disabled]):hover {\n        background-color: #fff;\n        color: #000;\n        border: 1px solid #000;\n      }\n    }\n\n    .df-input, .df-date {\n      label {\n        align-items: flex-start;\n        cursor: pointer;\n        display: flex;\n      }\n      input[type=\"text\"],\n      input[type=\"number\"],\n      input[type=\"date\"] {\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n\n        border-radius: 5px;\n        border: 0;\n        background-color: #8ec0ed30;\n        box-shadow: none;\n        box-sizing: border-box;\n        display: block;\n        padding: 5px 10px;\n        &:focus {\n          outline: none;\n          transition-duration: .4s;\n        }\n      }\n      input.other {\n        display: inline-block;\n      }\n    }\n\n    .df-content {\n      flex: 1 0 0;\n      padding: 25px 0 25px 0;\n      margin: 0 auto;\n    }\n\n    .df-control {\n      padding: 20px 0;\n      text-align: center;\n\n      button.back {\n        background-color: transparent;\n        border: 1px solid #ccc;\n        color: #ccc;\n        &:hover {\n          background-color: transparent !important;\n          border-color: #000;\n          color: #000;\n        }\n      }\n    }\n\n    .df-progress {\n      display: flex;\n      margin: 0;\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: 0;\n      z-index: 1;\n      li {\n        flex-grow: 1;\n        font-size: 12px;\n        text-align: center;\n        transition-duration: .4s;\n        border-top: 7px solid #555;\n        opacity: 0.25;\n        &.df-active {\n          opacity: 1;\n          border-top-color: #0055ff;\n        }\n      }\n    }\n\n    .df-scale {\n      .df-selection {\n        display: flex;\n      }\n      .range-slider-inner {\n        min-width: 80px;\n      }\n      .range-slider {\n        box-sizing: border-box;\n        display: block;\n        height: 40px;\n        margin-bottom: 10px;\n        width: 100%;\n\n        .range-slider-knob {\n          background-color: #8ec0ed;\n          border: none;\n          height: 25px;\n          width: 25px;\n        }\n\n        input[type=\"text\"] {\n          background: transparent;\n          border: none;\n          color: #004D50;\n          cursor: default;\n          font-size: 1rem;\n          padding-top: 40px;\n          text-align: center;\n          user-select: none;\n        }\n        .range-slider-fill {\n          background-color: #8ec0ed30;\n          border-radius: 25px;\n          height: 25px;\n        }\n        .range-slider-rail {\n          background-color: #e7e9e730;\n          border-radius: 25px;\n          height: 25px;\n        }\n      }\n    }\n\n    .vdpClearInput {\n      display: none;\n    }\n    .vdpCellContent {\n      font-size: 13px;\n    }\n    .vdpComponent {\n      width: 100%;\n\n      input {\n        font-size: 16px;\n        width: 100%;\n      }\n    }\n\n    .df-radio {\n      $marker-size: 19px;\n\n      .df-selector {\n        display: inline-block;\n\n        input {\n          display: none;\n        }\n\n        .df-marker {\n          align-items: center;\n          border-radius: $marker-size;\n          border: 1px solid #adc0c480;\n          display: flex;\n          height: $marker-size;\n          justify-content: center;\n          position: relative;\n          transition-duration: .4s;\n          width: $marker-size;\n        }\n        input:checked ~ .df-marker {\n          background-color: #8ec0ed;\n          border-color: #8ec0ed;\n        }\n        label:hover {\n          .df-marker {\n            border-color: #adc0c4;\n          }\n        }\n      }\n    }\n\n    .df-checkbox {\n      $marker-size: 19px;\n\n      .df-selector {\n        display: inline-block;\n        input[type=\"checkbox\"],\n        input[type=\"radio\"] {\n          display: none;\n        }\n        .df-marker {\n          align-items: center;\n          border-radius: $marker-size;\n          border: 1px solid #adc0c480;\n          display: flex;\n          height: $marker-size;\n          justify-content: center;\n          position: relative;\n          transition-duration: .4s;\n          width: $marker-size;\n        }\n        .df-icon {\n          position: absolute;\n          top: -25px;\n          left: -12px;\n          transform: scale(0);\n          transition-duration: .4s;\n        }\n        input:checked ~ .df-marker {\n          border-color: #8ec0ed;\n          .df-icon {\n            transform: scale(.5);\n          }\n        }\n        input[type='radio']:checked ~ .df-marker {\n          background-color: #8ec0ed;\n        }\n\n        .df-label {\n          padding: 0 0 0 10px;\n        }\n\n        label:hover {\n          .df-marker {\n            border-color: #adc0c4;\n          }\n        }\n      }\n    }\n  }\n</style>\n",".duckform {\n  font-size: 1rem;\n  text-align: left;\n}\n.duckform a {\n  transition-duration: 0.4s;\n}\n.duckform fieldset {\n  border-bottom: 1px solid #ccc;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  padding: 25px 0;\n  margin: 0 20px;\n}\n.duckform button {\n  transition-duration: 0.4s;\n}\n.duckform button:focus {\n  outline: none;\n}\n.duckform button:not([disabled]) {\n  cursor: pointer;\n}\n.duckform label {\n  display: block;\n  margin-bottom: 0;\n}\n.duckform p {\n  margin: 3px 0;\n}\n.duckform header p.df-section-description {\n  margin-left: 20px;\n}\n.duckform ul {\n  margin-bottom: 0;\n}\n.duckform .df-title {\n  font-size: 1.75rem;\n}\n.duckform .df-subtitle {\n  font-size: 1.25rem;\n}\n.duckform .df-row {\n  display: flex;\n}\n.duckform .df-tc {\n  text-align: center !important;\n}\n.duckform .df-tr {\n  text-align: right !important;\n}\n.duckform .df-tl {\n  text-align: left !important;\n}\n.duckform .df-td {\n  color: #dc3545 !important;\n}\n.duckform .df-list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.duckform .df-small {\n  font-size: 0.75em;\n}\n.duckform .df-w-25 {\n  width: 25% !important;\n}\n.duckform .df-w-50 {\n  width: 50% !important;\n}\n.duckform .df-w-100 {\n  width: 100% !important;\n}\n.duckform .df-py-1 {\n  padding-top: 0.25em !important;\n}\n.duckform .df-pb-1, .duckform .df-py-1 {\n  padding-bottom: 0.25em !important;\n}\n.duckform .df-pb-2 {\n  padding-bottom: 0.5em !important;\n}\n.duckform .df-pb-3 {\n  padding-bottom: 0.75em !important;\n}\n.duckform .df-pb-4 {\n  padding-bottom: 1em !important;\n}\n.duckform .df-pl-1 {\n  padding-left: 0.25em !important;\n}\n.duckform .df-pl-2 {\n  padding-left: 0.5em !important;\n}\n.duckform .df-mt-3 {\n  margin-top: 0.75em !important;\n}\n.duckform .df-mb-0 {\n  margin-bottom: 0 !important;\n}\n.duckform .df-mb-2 {\n  margin-bottom: 0.5em !important;\n}\n.duckform .df-mb-4 {\n  margin-bottom: 1em !important;\n}\n.duckform .df-ml-2 {\n  margin-left: 0.5em !important;\n}\n.duckform .df-button {\n  background-color: #8ec0ed;\n  border: none;\n  color: #fff;\n  display: inline-block;\n  font-size: 1.4rem;\n  padding: 15px 30px;\n  text-decoration: none;\n  border: 1px solid #fff;\n}\n.duckform .df-button[disabled] {\n  background-color: #dbebf9;\n}\n.duckform .df-button:not([disabled]):hover {\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #000;\n}\n.duckform .df-input label, .duckform .df-date label {\n  align-items: flex-start;\n  cursor: pointer;\n  display: flex;\n}\n.duckform .df-input input[type=text],\n.duckform .df-input input[type=number],\n.duckform .df-input input[type=date], .duckform .df-date input[type=text],\n.duckform .df-date input[type=number],\n.duckform .df-date input[type=date] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 5px;\n  border: 0;\n  background-color: #8ec0ed30;\n  box-shadow: none;\n  box-sizing: border-box;\n  display: block;\n  padding: 5px 10px;\n}\n.duckform .df-input input[type=text]:focus,\n.duckform .df-input input[type=number]:focus,\n.duckform .df-input input[type=date]:focus, .duckform .df-date input[type=text]:focus,\n.duckform .df-date input[type=number]:focus,\n.duckform .df-date input[type=date]:focus {\n  outline: none;\n  transition-duration: 0.4s;\n}\n.duckform .df-input input.other, .duckform .df-date input.other {\n  display: inline-block;\n}\n.duckform .df-content {\n  flex: 1 0 0;\n  padding: 25px 0 25px 0;\n  margin: 0 auto;\n}\n.duckform .df-control {\n  padding: 20px 0;\n  text-align: center;\n}\n.duckform .df-control button.back {\n  background-color: transparent;\n  border: 1px solid #ccc;\n  color: #ccc;\n}\n.duckform .df-control button.back:hover {\n  background-color: transparent !important;\n  border-color: #000;\n  color: #000;\n}\n.duckform .df-progress {\n  display: flex;\n  margin: 0;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n.duckform .df-progress li {\n  flex-grow: 1;\n  font-size: 12px;\n  text-align: center;\n  transition-duration: 0.4s;\n  border-top: 7px solid #555;\n  opacity: 0.25;\n}\n.duckform .df-progress li.df-active {\n  opacity: 1;\n  border-top-color: #0055ff;\n}\n.duckform .df-scale .df-selection {\n  display: flex;\n}\n.duckform .df-scale .range-slider-inner {\n  min-width: 80px;\n}\n.duckform .df-scale .range-slider {\n  box-sizing: border-box;\n  display: block;\n  height: 40px;\n  margin-bottom: 10px;\n  width: 100%;\n}\n.duckform .df-scale .range-slider .range-slider-knob {\n  background-color: #8ec0ed;\n  border: none;\n  height: 25px;\n  width: 25px;\n}\n.duckform .df-scale .range-slider input[type=text] {\n  background: transparent;\n  border: none;\n  color: #004D50;\n  cursor: default;\n  font-size: 1rem;\n  padding-top: 40px;\n  text-align: center;\n  user-select: none;\n}\n.duckform .df-scale .range-slider .range-slider-fill {\n  background-color: #8ec0ed30;\n  border-radius: 25px;\n  height: 25px;\n}\n.duckform .df-scale .range-slider .range-slider-rail {\n  background-color: #e7e9e730;\n  border-radius: 25px;\n  height: 25px;\n}\n.duckform .vdpClearInput {\n  display: none;\n}\n.duckform .vdpCellContent {\n  font-size: 13px;\n}\n.duckform .vdpComponent {\n  width: 100%;\n}\n.duckform .vdpComponent input {\n  font-size: 16px;\n  width: 100%;\n}\n.duckform .df-radio .df-selector {\n  display: inline-block;\n}\n.duckform .df-radio .df-selector input {\n  display: none;\n}\n.duckform .df-radio .df-selector .df-marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.duckform .df-radio .df-selector input:checked ~ .df-marker {\n  background-color: #8ec0ed;\n  border-color: #8ec0ed;\n}\n.duckform .df-radio .df-selector label:hover .df-marker {\n  border-color: #adc0c4;\n}\n.duckform .df-checkbox .df-selector {\n  display: inline-block;\n}\n.duckform .df-checkbox .df-selector input[type=checkbox],\n.duckform .df-checkbox .df-selector input[type=radio] {\n  display: none;\n}\n.duckform .df-checkbox .df-selector .df-marker {\n  align-items: center;\n  border-radius: 19px;\n  border: 1px solid #adc0c480;\n  display: flex;\n  height: 19px;\n  justify-content: center;\n  position: relative;\n  transition-duration: 0.4s;\n  width: 19px;\n}\n.duckform .df-checkbox .df-selector .df-icon {\n  position: absolute;\n  top: -25px;\n  left: -12px;\n  transform: scale(0);\n  transition-duration: 0.4s;\n}\n.duckform .df-checkbox .df-selector input:checked ~ .df-marker {\n  border-color: #8ec0ed;\n}\n.duckform .df-checkbox .df-selector input:checked ~ .df-marker .df-icon {\n  transform: scale(0.5);\n}\n.duckform .df-checkbox .df-selector input[type=radio]:checked ~ .df-marker {\n  background-color: #8ec0ed;\n}\n.duckform .df-checkbox .df-selector .df-label {\n  padding: 0 0 0 10px;\n}\n.duckform .df-checkbox .df-selector label:hover .df-marker {\n  border-color: #adc0c4;\n}\n\n/*# sourceMappingURL=Duckform.vue.map */"]}, media: undefined });

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

  exports.default = __vue_component__$5;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
