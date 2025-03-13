import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView/HomeView.vue";
import AboutUsView from "../views/AboutUsView/AboutUsView.vue";
import ContactView from "../views/ContactView/Contact.vue";
import OfferView from "@/views/OfferView/OfferView.vue";
import LottoGameView from "@/views/LottoGameView/LottoGameView.vue";
import SlotsView from "@/views/SlotsView/SlotsView.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
  },
  {
    path: "/aboutUs",
    name: "aboutUs",
    component: AboutUsView,
  },
  {
    path: "/offer",
    name: "Offer",
    component: OfferView,
  },
  {
    path: "/lotto",
    name: "Lotto Simulation",
    component: LottoGameView,
  },
  {
    path: "/slots",
    name: "Slots",
    component: SlotsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
