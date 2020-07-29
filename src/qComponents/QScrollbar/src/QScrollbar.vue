<template>
  <div class="q-scrollbar">
    <div
      ref="wrap"
      class="q-scrollbar__wrap"
      :class="classes"
      :style="styles"
      @scroll="handleScroll"
    >
      <div
        ref="resize"
        class="q-scrollbar__view"
        :class="viewClass"
        :style="viewStyle"
      >
        <slot />
      </div>
    </div>
    <q-bar
      type="horizontal"
      :move="moveX"
      :size="sizeWidth"
    />
    <q-bar
      type="vertical"
      :move="moveY"
      :size="sizeHeight"
    />
  </div>
</template>

<script>
import { scrollBarWidth } from './util';
import { addResizeListener, removeResizeListener } from '../../helpers';
import QBar from './QBar';

export default {
  name: 'QScrollbar',

  components: { QBar },

  props: {
    native: { type: Boolean, default: false },
    wrapClass: { type: [Object, String], default: '' },
    viewClass: { type: [Object, String], default: '' },
    viewStyle: { type: Object, default: null },
    noresize: { type: Boolean, default: false }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    },
    classes() {
      return [this.wrapClass, { 'q-scrollbar__wrap_hidden-default': true }];
    },
    styles() {
      const gutter = scrollBarWidth();
      let styles = {};
      if (gutter) {
        const gutterWith = `-${gutter}px`;
        const gutterStyles = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
        styles = gutterStyles;
      }

      return styles;
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  },

  methods: {
    handleScroll() {
      const { wrap } = this;

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },

    update() {
      const { wrap } = this;
      if (!wrap) return;

      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
      this.sizeWidth = widthPercentage < 100 ? `${widthPercentage}%` : '';
    }
  }
};
</script>