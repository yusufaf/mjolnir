# Xbox App — Recon: AutomationIds & baseline colors

Source: UWPSpy attached to `XboxPcApp.exe`. Architecture = React Native for Windows
(root: `Windows.UI.Xaml.Controls.Grid - ReactRootView`).

Click each element with a non-empty `AutomationProperties.AutomationId`; record its id,
type, and current color properties. These are the theming targets.

| AutomationId | Element type | Region | Foreground | Background | BorderBrush | Notes |
|---|---|---|---|---|---|---|
| `NavItem_ButtonLabel` | TextBlock | Left nav label ("Home") | `#FFFFFF` | — | — | Confirmed in recon. MVP target. |

## TODO targets to find
- [ ] Sidebar / left-nav container background
- [ ] Selected nav item highlight (purple state)
- [ ] Search bar
- [ ] Game card / tile background
- [ ] Top header area
- [ ] App window / page background
