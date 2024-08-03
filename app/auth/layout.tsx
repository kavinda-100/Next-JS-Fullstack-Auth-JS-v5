import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: LayoutProps) => {
  return (
    <section className="flex flex-col h-full justify-center items-center text-white">
      {children}
    </section>
  );
};

export default layout;
