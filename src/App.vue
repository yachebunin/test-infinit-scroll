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

    <!-- Тут сделал триггер, при попадании в зону видимости гружу новую "порцию" -->
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
     * Массив пользователей, загружаемых с API randomuser.me
     */
    const users = ref([]);

    /**
     * @type {import('vue').Ref<HTMLElement|null>}
     * Ссылка на элемент-триггер, который отслеживается Intersection Observer'ом
     */
    const infiniteScrollTrigger = ref(null);

    // Получаем метод для подгрузки новых пользователей из кастомного хука
    const { loadMoreUsers } = useInfiniteScroll(users, infiniteScrollTrigger);

    /**
     * Первая загрузка данных при монтировании.
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
