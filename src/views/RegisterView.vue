<script setup lang="ts">
import Input from "@/components/Input.vue";
import CompanyBanner from "@/components/CompanyBanner.vue";
import {useDark} from "@vueuse/core";
import {useRouter} from "vue-router";
import {onBeforeUnmount, ref} from "vue";
import {supabase} from "@/../supabase.js";
import Button from "@/components/Button.vue";

const isDark = useDark()
const router = useRouter()

const loading = ref(false)

const mail = ref('')
const pw = ref('')

const errorMessage = ref('')

const register = async () => {
  const newUser = ref<Record<string, any>>([])
  if (mail.value != '' && pw.value != '') {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signUp({
        email: mail.value,
        password: pw.value,
      })
      if (error) {
        errorMessage.value = error.message
        loading.value = false;
      } else {
        errorMessage.value = ''
      }

      newUser.value = data
    } catch (error: any) {
      console.log(error.message)
    } finally {
      if (newUser.value.user.email) {
        await router.push('/login')

        try {
          const { data, error } = await supabase
              .from('account')
              .insert({
                user_id: newUser.value.user.id,
                name: 'New',
                surname: 'User',
                telephone: '+49-000-0000-0000',
                role_id: 1,
                department_id: null,
                creation_date: new Date(),
                email: newUser.value.user.email
              })
        } catch (error: any) {
          console.log(error.message)
        }
      }
      loading.value = false;
    }
  } else {
    errorMessage.value = 'Please enter your email and password'
  }
}

const updateMail = (event: string) => {
  mail.value = event
}

const updatePassword = (event: string) => {
  pw.value = event
}

const container = ref()
onBeforeUnmount(() => {
  container.value.style = 'display: none'
})
</script>

<template>
  <div ref="container" class="register-container" :class="{dark: isDark}">
    <div class="banner">
      <CompanyBanner />
    </div>
    <div class="bg-container">
      <div class="create-acc">
        Create your account
      </div>
      <div class="error-message">
        {{ errorMessage }}
      </div>
      <div class="register-inputs">
        <Input @value-changed-email="updateMail($event)" type="email" label="email"/>
        <Input @value-changed-password="updatePassword($event)" type="password" label="password"/>
        <span class="confirmation">You will receive a confirmation mail</span>
      </div>
      <div class="register-button">
        <Button @click="register()" :loading="loading" button-type="cancel" label="Register" />
      </div>
    </div>
    <div class="to-register">
      Already have an account?
      <RouterLink to="/login" class="link">Go to login.</RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-container {
  display: flex;
  width: 100%;
  height: 100dvh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: $bg-dark;

  &.dark {
    background: $bg-light;

    .bg-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: $bg-dark;
      padding: 3rem 6rem;
      border-radius: $radius-standard;
      width: 30%;

      .create-acc {
        color: $text-dark;
      }
    }

    .error-message {
      color: $text-dark;
    }

    .confirmation {
      color: $text-dark;
    }

    .to-register {
      color: $text-light;
    }
  }

  .banner {
    margin-bottom: 2rem;
  }

  .bg-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
    flex-direction: column;
    background: $bg-light;
    padding: 3rem 6rem;
    border-radius: $radius-standard;

    .create-acc {
      font-size: 30px;
      margin-bottom: 2rem;
      color: $text-light;
      white-space: nowrap;
    }

    .register-inputs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 1rem;
    }
  }

  .error-message {
    height: 2rem;
    color: $text-light;
    margin-bottom: 3rem;
    white-space: nowrap;
  }

  .confirmation {
    color: $text-light;
    margin-top: -1.5rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  .to-register {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    color: $text-dark;

    .link {
      color: inherit;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>