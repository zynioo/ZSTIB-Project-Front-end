import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView/HomeView.vue";
import AboutUsView from "../views/AboutUsView/AboutUsView.vue";
import ContactView from "../views/ContactView/Contact.vue";
import OfferView from "@/views/OfferView/OfferView.vue";
import LottoGameView from "@/views/LottoGameView/LottoGameView.vue";
import SlotsView from "@/views/SlotsView/SlotsView.vue";
import RouletteView from "@/views/RouletteView/RouletteView.vue";
import RockPaperScissorsView from "@/views/RockPaperScissorsView/RockPaperScissorsView.vue";
import ExchangeRatesView from "@/views/ExchangeRatesView/ExchangeRatesView.vue";
import WeatherAppView from "@/views/WeatherAppView/WeatherAppView.vue";
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
  {
    path: "/roulette",
    name: "Roulette",
    component: RouletteView,
  },
  {
    path: "/rockPaperScissors",
    name: "Rock Paper Scissors",
    component: RockPaperScissorsView,
  },
  {
    path: "/exchangeRates",
    name: "Exchange Rates",
    component: ExchangeRatesView,
  },
  {
    path: "/weatherApp",
    name: "Weather App",
    component: WeatherAppView,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
