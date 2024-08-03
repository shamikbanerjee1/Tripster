import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      {/* Your layout components like header, sidebar, etc. */}
      <Outlet />
      {/* This is where the nested routes' components will be rendered */}
    </div>
  );
}

export default AppLayout;
