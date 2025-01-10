import { onMounted, onUnmounted } from 'vue';

/**
 * Кастомный хук для реализации бесконечной прокрутки.
 * Использует IntersectionObserver для подгрузки новых данных,
 * когда элемент-триггер попадает в зону видимости.
 *
 * @param {import('vue').Ref<Array>} usersRef - Ссылка на массив пользователей
 * @param {import('vue').Ref<HTMLElement|null>} triggerRef - Ссылка на триггер-элемент
 * @returns {{ loadMoreUsers: Function }} Объект с методом "loadMoreUsers"
 */
export default function useInfiniteScroll(usersRef, triggerRef) {
  /**
   * Текущая страница для запроса к RandomUser API.
   * @type {number}
   */
  let page = 1;

  /**
   * Экземпляр IntersectionObserver.
   * @type {IntersectionObserver|null}
   */
  let observer = null;

  /**
   * Загружаю новую порцию пользователей (по 20 за запрос)
   * @returns {Promise<void>}
   */
  async function loadMoreUsers() {
    const url = `https://randomuser.me/api/?page=${page}&results=20`;
    page++;

    /**
     * @typedef {Response} FetchResponse
     * @description Объект ответа от fetch(), который можно конвертировать в JSON.
     */
    const response = await fetch(url);

    /**
     * @typedef {Object} RandomUserApiResponse
     * @property {Array} results - Массив пользователей
     */
    /** @type {RandomUserApiResponse} */
    const data = await response.json();

    // Добавляю новые записи к массиву (без полной перезаписи)
    usersRef.value.push(...data.results);
  }

  /**
   * Обработчик, вызываемый при пересечении триггер-элемента с viewport.
   * Если элемент виден, загружаю следующую "партию" пользователей.
   * @param {IntersectionObserverEntry[]} entries
   */
  function handleIntersection(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      loadMoreUsers();
    }
  }

  /**
   * Инициализируем IntersectionObserver при монтировании.
   */
  onMounted(() => {
    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.1,
    });
    if (triggerRef.value) {
      observer.observe(triggerRef.value);
    }
  });

  /**
   * Отключаем IntersectionObserver при размонтировании.
   */
  onUnmounted(() => {
    if (observer && triggerRef.value) {
      observer.unobserve(triggerRef.value);
      observer.disconnect();
    }
  });

  return {
    loadMoreUsers,
  };
}
