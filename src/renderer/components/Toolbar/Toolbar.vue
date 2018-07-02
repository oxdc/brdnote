<template>
  <div id="toolbar">
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>

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

    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>

    <button class="ql-blockquote"></button>
    <button class="ql-code-block"></button>

    <button class="ql-indent" value="+1"></button>
    <button class="ql-indent" value="-1"></button>
    <button class="ql-direction" value="rtl"></button>

    <select class="ql-color"></select>
    <select class="ql-background"></select>

    <button class="ql-formula"></button>
    <button class="ql-link"></button>
    <button class="ql-image"></button>
    <button class="ql-video"></button>

    <button class="ql-clean"></button>
  </div>
</template>

<script>
export default {
  name: 'Toolbar'
}
</script>
