<template>
  <div class="user-card">
    <img
      :src="userData.picture.thumbnail"
      :alt="fullName"
      class="user-card__img"
    />
    <div class="user-card__info">
      <h3>{{ fullName }}</h3>
      <p>{{ userData.email }}</p>
    </div>
  </div>
</template>

<script>
/**
 * A component that displays an individual user's photo, name, and email.
 */
export default {
  name: 'UserCard',
  props: {
    /**
     * An object from the RandomUser API representing the user data.
     */
    userData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /**
     * Returns the user's full name (first + last).
     * @returns {string}
     */
    fullName() {
      const { first, last } = this.userData.name;
      return `${first} ${last}`;
    },
  },
};
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background-color: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-card__img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 12px;
}

.user-card__info {
  flex-grow: 1;
  padding: 8px;
}

h3 {
  font-size: 1.1rem;
  margin: 0 0 4px 0;
}

p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}
</style>
