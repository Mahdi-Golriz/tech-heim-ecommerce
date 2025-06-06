interface MinimalLayoutProps {
  children: React.ReactNode;
}

// Without header and footer
const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default MinimalLayout;
