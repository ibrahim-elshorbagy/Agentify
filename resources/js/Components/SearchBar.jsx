import React from "react";
import { router } from "@inertiajs/react";

export default function SearchBar({
  placeholder,
  defaultValue,
  queryKey = "name",
  routeName,
  icon,
  routeParams = {},
  pageParam = 'page',
}) {
  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;

    let queryString = { ...Object.fromEntries(new URLSearchParams(window.location.search)) };

    if (e.target.value) {
      queryString[queryKey] = e.target.value;
    } else {
      delete queryString[queryKey];
    }

    // Reset page to 1 when searching
    queryString[pageParam] = 1;

    router.get(route(routeName, routeParams), queryString, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i
          className={`fa-solid ${icon || "fa-magnifying-glass"} text-neutral-500 dark:text-neutral-400`}
        ></i>
      </div>
      <input
        type="text"
        className="block w-full p-2 pl-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-green-500 focus:border-green-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
