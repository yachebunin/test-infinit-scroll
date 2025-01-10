import { onMounted, onUnmounted } from 'vue';

/**
 * A custom hook for implementing infinite scroll.
 * It uses IntersectionObserver to detect when the trigger element
 * enters the viewport, then fetches the next batch of users.
 *
 * @param {import('vue').Ref<Array>} usersRef - A ref holding the array of users
 * @param {import('vue').Ref<HTMLElement|null>} triggerRef - A ref to the sentinel element
 * @returns {{ loadMoreUsers: Function }} An object with the loadMoreUsers function
 */
export default function useInfiniteScroll(usersRef, triggerRef) {
  /**
   * Current page for the RandomUser API (used to demonstrate pagination).
   * @type {number}
   */
  let page = 1;

  /**
   * The IntersectionObserver instance (or null if not yet created).
   * @type {IntersectionObserver|null}
   */
  let observer = null;

  /**
   * Fetches more users (20 per request) from the RandomUser API.
   * @returns {Promise<void>}
   */
  async function loadMoreUsers() {
    const url = `https://randomuser.me/api/?page=${page}&results=20`;
    page++;

    /**
     * @typedef {Response} FetchResponse
     * This is the raw response from fetch(), can be converted to JSON.
     */
    const response = await fetch(url);

    /**
     * @typedef {Object} RandomUserApiResponse
     * @property {Array} results - The array of user objects
     */
    /** @type {RandomUserApiResponse} */
    const data = await response.json();

    // Append new users without re-creating the entire array
    usersRef.value.push(...data.results);
  }

  /**
   * Callback for IntersectionObserver. Loads more users if the
   * sentinel element is in view.
   * @param {IntersectionObserverEntry[]} entries
   */
  function handleIntersection(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      loadMoreUsers();
    }
  }

  /**
   * Initialize the IntersectionObserver when the component is mounted.
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
   * Clean up the IntersectionObserver when the component is unmounted.
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
