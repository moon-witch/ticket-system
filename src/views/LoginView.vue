<script setup lang="ts">
import CompanyBanner from "@/components/CompanyBanner.vue";
import Input from "@/components/Input.vue";
import {useDark} from "@vueuse/core";
import { supabase } from "@/../supabase";
import {ref} from "vue";
import {useRouter} from "vue-router";
import Button from "@/components/Button.vue"
import ExampleAccountModal from "@/components/ExampleAccountModal.vue";

const isDark = useDark()
const router = useRouter()

const loading = ref(false)
const modalOpen = ref(false)

const mail = ref('')
const pw = ref('')

const errorMessage = ref('')

const signIn = async () => {
  if (mail.value != '' && pw.value != '') {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: mail.value,
        password: pw.value,
      })
      if (error) {
        errorMessage.value = error.message
        loading.value = false;
      } else {
        errorMessage.value = ''
      }
      if (data && data.user?.email) {
        localStorage.setItem('loggedIn', 'true')
        await router.push('/landing')
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false;
    }
  } else {
    errorMessage.value = 'Please enter your email and password'
  }
}

const updateMail = (event: any) => {
  mail.value = event
}

const updatePassword = (event: any) => {
  pw.value = event
}
</script>

<template>
  <main class="main">
    <ExampleAccountModal :visible="modalOpen" @close="modalOpen = false" />
    <div class="login-container" :class="{dark: isDark}">
      <div class="example-accounts" @click="modalOpen = true">
        <v-icon name="la-info-circle-solid" label="Dashboard" title="Dashboard" scale="3"></v-icon>
      </div>
      <div class="banner">
        <CompanyBanner />
      </div>
      <div class="error-message">
        {{ errorMessage }}
      </div>
      <div class="login-inputs">
        <Input @value-changed-email="updateMail($event)" @keyup.enter="signIn()" type="email" label="email"/>
        <Input @value-changed-password="updatePassword($event)" @keyup.enter="signIn()" v-model="pw" type="password" label="password"/>
      </div>
      <div>
        <Button @click="signIn()" :loading="loading" button-type='submit' label="Login" />
      </div>
      <div class="to-register">
        Don't have an account yet?
        <RouterLink to="/register" class="link">Register.</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  height: 100dvh;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 1440px) {
    flex-direction: column;
  }

  .example-accounts {
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: $text-light;

    &:hover {
      cursor: pointer;
    }
  }

  &.dark {
    .example-accounts {
      color: $text-dark;
    }
    .error-message {
      color: $text-dark;
    }

    .to-register {
      color: $text-dark;
    }
  }
  .error-message {
    height: 2rem;
    color: $text-light;
    margin-bottom: 3rem;
  }

  .banner {
    margin-bottom: 5rem;
  }

  .login-inputs {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    margin-bottom: 1rem;
  }

  .to-register {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    color: $text-light;

    .link {
      color: inherit;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>