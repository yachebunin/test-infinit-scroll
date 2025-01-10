<template>
  <div class="app-container">
    <h1>Бесконечная прокрутка (Тестовое)</h1>

    <div class="users-list">
      <UserCard
        v-for="(user, index) in users"
        :key="user.login.uuid"
        :userData="user"
      />
    </div>

    <!-- A sentinel (trigger) element. When it enters the viewport,
         we load the next batch of users. -->
    <div ref="infiniteScrollTrigger" class="scroll-trigger">
      <p>Загружаю...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserCard from './components/UserCard.vue';
import useInfiniteScroll from './composables/useInfiniteScroll.js';

/**
 * @typedef {Object} RandomUser
 * @property {Object} name
 * @property {string} name.first
 * @property {string} name.last
 * @property {Object} picture
 * @property {string} picture.thumbnail
 * @property {string} email
 * @property {Object} login
 * @property {string} login.uuid
 */

export default {
  name: 'App',
  components: {
    UserCard,
  },
  setup() {
    /**
     * @type {import('vue').Ref<RandomUser[]>}
     * A reactive array of users from the RandomUser API
     */
    const users = ref([]);

    /**
     * @type {import('vue').Ref<HTMLElement|null>}
     * A reference to the trigger element for the infinite scroll
     */
    const infiniteScrollTrigger = ref(null);

    // Destructure our custom composable to get the loadMoreUsers method
    const { loadMoreUsers } = useInfiniteScroll(users, infiniteScrollTrigger);

    /**
     * Initial data load when the component is mounted.
     */
    onMounted(() => {
      loadMoreUsers();
    });

    return {
      users,
      infiniteScrollTrigger,
    };
  },
};
</script>

<style scoped>
.app-container {
  margin: 0 auto;
  max-width: 800px;
  padding: 16px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.scroll-trigger {
  text-align: center;
  color: #666;
  padding: 16px;
}
</style>
