<template>
  <div class="container">
    <h1>Profile</h1>
    <div class="form">
      <div class="header">
        <span class="profile">Profile:</span>
        <Button v-if="!isEditMode" label="edit" size="small" severity="info" text @click="isEditMode = !isEditMode"/>
      </div>
      <div class="form-item">
        <span class="label">Username:</span>
        <span class="value" v-if="!isEditMode">{{ user.name }}</span>
        <InputText class="value" v-else v-model="userNameRef" />
      </div>
      <div class="form-item">
        <span class="label">Todos Completed:</span>
        <span class="value">{{ user.completedTodos }}</span>
        <!-- <InputText class="value" v-else v-model="userNameRef" /> -->
      </div>
      <div v-if="isEditMode" class="button-wrapper">
        <Button label="save" severity="info" @click="handleUpdateUserInfo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
const user = userStore.getUser()

const isEditMode = ref(false)
const userNameRef = ref(user.name || "")

const handleUpdateUserInfo = async () => {
  const updatedUser = await $fetch("/api/users", {
    method: "PUT",
    body: {userId: user.id, updatedName: userNameRef.value}
  })
  if (updatedUser) {
    userStore.setUser(updatedUser)
    isEditMode.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30vh;
  }

  .form {
    border: 1px solid rgb(216, 216, 216);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    max-width: 600px;

    > .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > .profile {
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    > .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      min-height: 50px;

      > .label {
        font-weight: 500;
      }

      > .value {
        min-width: 300px;

      }
    }
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    margin: 0.5rem 0;
  }
</style>
