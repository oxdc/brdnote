<template>
  <div id="toolbar">
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
      <select class="ql-align"></select>
    </span>

    <span class="ql-formats">
      <select class="ql-header">
        <option selected></option>
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option value="4"></option>
        <option value="5"></option>
        <option value="6"></option>
      </select>
      <select class="ql-size">
        <option value="small"></option>
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <select class="ql-font"></select>
    </span>

    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
  
    <span class="ql-formats">
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
    </span>

    <span class="ql-formats">
      <button class="ql-indent" value="+1"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-direction" value="rtl"></button>
    </span>

    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    
    <span class="ql-formats">
      <button class="ql-formula"></button>
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
    </span>

    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>

    <span class="ql-formats">
      <button
       class="ivu-icon ivu-icon-ios-undo"
       style="font-size: 18px;"
       @click="onClickUndo"
      >
      </button>
      <button
       class="ivu-icon ivu-icon-ios-redo"
       style="font-size: 18px;"
       @click="onClickRedo"
      >
      </button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  methods: {
    onClickUndo (event) {
      if (window.editor && window.editor.history) {
        window.editor.history.undo()
      }
    },
    onClickRedo (event) {
      if (window.editor && window.editor.history) {
        window.editor.history.redo()
      }
    }
  }
}
</script>
