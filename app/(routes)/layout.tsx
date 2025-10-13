import React from "react";
import AppHeader from "./_components/AppHeader";

function DashBoardlayout({ children }: any) {
  return (
    <div>
      <AppHeader />

      {children}
    </div>
  );
}

export default DashBoardlayout;
