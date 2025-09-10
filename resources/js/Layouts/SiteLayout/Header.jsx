import TabletNavigation from "./HeaderPartials/TabletNavigation";
import WebNavigation from "./HeaderPartials/WebNavigation";

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <WebNavigation/>
      <TabletNavigation/>
    </header>
  );
}
