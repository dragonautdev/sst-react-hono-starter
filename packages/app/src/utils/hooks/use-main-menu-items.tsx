

export function useMainMenuItems({ accountSlug }: { accountSlug: string }) {
  let menuItemsTop = [
    // {
    //   icon: <Icon icon="graph" />,
    //   to: "dashboard",
    //   label: "Dashboard",
    // },

    {
    //   icon: <Icon icon="settings" />,
      to: `/dashboard/${accountSlug}/settings`,
      label: "Settings",
      end: true,
    },
  ];
  const menuItemsBottom = [
    
    {
    //   icon: <Icon icon="settings" />,
      to: "settings",
      label: "Settings",
      end: true,
    },
  ];



  return {
    menuItemsTop,
    menuItemsBottom,
  };
}
