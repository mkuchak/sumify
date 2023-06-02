import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Video } from "@/pages/Video";
import { Route, Routes } from "react-router-dom";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/*" element={<Video />} />
      </Route>
    </Routes>
  );
}
