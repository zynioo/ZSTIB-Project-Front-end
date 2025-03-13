<template>
  <div class="col-lg-6 p-0 form-container">
    <div class="services-header">
      <slot name="header"></slot>
    </div>
    <div class="services-header">
      <div class="services-header-content">
        <hr class="line" />
        <span></span>
      </div>
      <div class="services-description">
        <slot name="description"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style></style>
