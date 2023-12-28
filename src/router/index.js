import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Slide",
    meta: {
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SlideShow.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
