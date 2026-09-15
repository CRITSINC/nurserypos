import Container from "@/components/admin/ui/container";
import Profile from "@/components/admin/shared/header/Profile";
import NavMenuToggle from "@/components/admin/shared/header/NavMenuToggle";
import ThemeToggle from "@/components/admin/shared/header/ThemeToggle";
import Notifications from "@/components/admin/shared/notifications/Notifications";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full bg-popover py-4 shadow-sm z-40 print:hidden">
      <Container>
        <div className="flex justify-between">
          <NavMenuToggle />

          <div className="flex items-center gap-x-2 ml-auto">
            {/* <ThemeToggle /> */}
            {/* <Notifications /> */}
            <Profile />
          </div>
        </div>
      </Container>
    </header>
  );
}
