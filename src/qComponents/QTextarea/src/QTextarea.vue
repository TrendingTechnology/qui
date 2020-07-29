<template>
  <div
    :class="classes"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      v-if="isSymbolLimitShown"
      class="q-textarea__count"
    >
      Количество знаков: {{ textLength }}/{{ upperLimit }}
    </div>
    <textarea
      ref="textarea"
      :tabindex="tabindex"
      class="q-textarea__inner"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :style="textareaStyle"
      :aria-label="label"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    />
  </div>
</template>
<script>
import emitter from '../../mixins/emitter';
import inputs from '../../mixins/inputs';
import calcTextareaHeight from './calcTextareaHeight';

export default {
  name: 'QTextarea',

  componentName: 'QTextarea',

  mixins: [emitter, inputs],

  props: {
    resize: {
      type: String,
      default: 'vertical',
      validator: value =>
        ['vertical', 'horizontal', 'both', 'none'].includes(value)
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    }
  },

  data() {
    return {
      textareaCalcStyle: {}
    };
  },

  computed: {
    classes() {
      const mainClass = 'q-textarea';

      return [
        mainClass,
        {
          [`${mainClass}_disabled`]: this.inputDisabled
        }
      ];
    },
    textareaStyle() {
      return { ...this.textareaCalcStyle, resize: this.resize };
    },

    componentRef() {
      return this.$refs.textarea;
    }
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
    }
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
  },

  methods: {
    resizeTextarea() {
      const { autosize } = this;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(
        this.$refs.textarea,
        minRows,
        maxRows
      );
    }
  }
};
</script>