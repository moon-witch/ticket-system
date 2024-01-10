<script setup lang="ts">

</script>

<template>
  <main class="notfound-container">
    <div></div>
    <h2 class="number">404</h2>
    <h2 class="text">Page Not Found</h2>
    <h2 class="action">
      <router-link to="/">return to dashboard</router-link>
    </h2>
  </main>
</template>

<style scoped lang="scss">
html,
body{
  margin: 0;
  overflow: hidden;
}

div{
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  background: radial-gradient(circle, $bg-light 0%, $bg-dark 100%);
  overflow: hidden;
}

h2{
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 60px;
  text-transform: uppercase;
  transform: translate(-50%, -50%);
  display: block;
  color: $bg-light;
  font-weight: 300;
  font-family: "quicksandregular", sans-serif;
  text-shadow: 0 0 4px $bg-light;
  animation: fadeInText 3s ease-in 3.5s forwards, flicker 5s linear 7.5s infinite, hueRotate 6s ease-in-out 3s infinite;
  z-index: 1001;

  &.number {
    top: 15rem;
    font-size: 150px;
  }

  &.action {
    top: 50rem;
    font-size: 32px;

    a {
      color: $bg-dark;
      text-decoration: none;
    }
  }
}

@keyframes flicker{
  0%  {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  30% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  31% {color: $bg-light;text-shadow:0px 0px 4px $bg-light;}
  32% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  36% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  37% {color: $bg-light;text-shadow:0px 0px 4px $bg-light;}
  41% {color: $bg-dark;text-shadow:0px 0px 4px $bg-light;}
  42% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  85% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  86% {color: $bg-light;text-shadow:0px 0px 4px $bg-light;}
  95% {color: $bg-light;text-shadow:0px 0px 4px $bg-light;}
  96% {color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
  100%{color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
}

@keyframes fadeInText{
  1%  {color: $bg-light;text-shadow:0px 0px 4px $bg-light;}
  70% {color: $bg-dark;text-shadow:0px 0px 14px $bg-dark;}
  100%{color: $bg-dark;text-shadow:0px 0px 4px $bg-dark;}
}

@keyframes hueRotate{
  0%  {
    filter: hue-rotate(0deg);
  }
  50%  {
    filter: hue-rotate(-120deg);
  }
  100%  {
    filter: hue-rotate(0deg);
  }
}
</style>