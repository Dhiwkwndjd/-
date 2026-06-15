import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <h1>Сервис поиска попутчиков</h1>

      <Outlet />
    </div>
  );
}

export default MainLayout;