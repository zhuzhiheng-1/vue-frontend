<template>
  <div class="experiment-content">
    <h2 class="experiment-title">{{ title }}</h2>
    <p class="experiment-text">{{ content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.experiment-content {
  max-width: 95%;
  margin: 0 auto;
  height: 75vh;
  padding: 20px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.experiment-title {
  font-size: 30px;
  margin-bottom: 10px;
}

.experiment-text {
  font-size: 23px;
  line-height: 1.6;
  color: #333;
}
</style>
