import { createBrowserRouter } from "react-router";
import Root from "@/app/Root";
import Home from "@/app/pages/Home";
import MoodEntry from "@/app/pages/MoodEntry";
import MoodSelection from "@/app/pages/MoodSelection";
import Questions from "@/app/pages/Questions";
import Journal from "@/app/pages/Journal";
import Suggestions from "@/app/pages/Suggestions";
import Statistics from "@/app/pages/Statistics";
import Tools from "@/app/pages/Tools";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "mood-entry", Component: MoodEntry },
      { path: "mood-selection", Component: MoodSelection },
      { path: "questions", Component: Questions },
      { path: "journal", Component: Journal },
      { path: "suggestions", Component: Suggestions },
      { path: "statistics", Component: Statistics },
      { path: "tools", Component: Tools },
    ],
  },
]);