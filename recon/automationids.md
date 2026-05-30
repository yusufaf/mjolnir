# Xbox App — Recon: AutomationIds & baseline colors

Source: UWPSpy attached to `XboxPcApp.exe`. Architecture = React Native for Windows
(root: `Windows.UI.Xaml.Controls.Grid - ReactRootView`).

## Selector grammar (Mjolnir / styler engine)
- `Class#Name[Property=Value]` — `#Name` matches element **Name** (x:Name).
- Match by AutomationId: `Class[AutomationProperties.AutomationId=Foo]`
- Match by text: `Class[Text=Foo]`
- Visual state: `Class#Name@VisualStateGroup` (style with state prefix applies in that state)
- Color values: `Foreground=#AARRGGBB` (FF = opaque). `:=` sets a XAML value/binding.

## Confirmed working (gates 1-3, 2026-05-30)
| Selector | Style | Effect |
|---|---|---|
| `Windows.UI.Xaml.Controls.TextBlock` | `Foreground=#FFFF0000` | ALL text red (injection sanity) |
| `Windows.UI.Xaml.Controls.TextBlock[AutomationProperties.AutomationId=NavItem_ButtonLabel]` | `Foreground=#FFFF6A00` | Nav labels only (Home/Game Pass/…) |

## Capture procedure (per target)
1. UWPSpy → click the element in the live tree (red overlay highlights it).
2. Attributes panel → record `AutomationProperties.AutomationId` (if any), element **type**, and current `Background` / `Foreground` / `BorderBrush` color values.
3. If no AutomationId: note the `Text` value or the class-path chain to it.
4. Add a row below. Then test a selector in the mod's Control styles.

## Target wishlist (fill in)
| Region | AutomationId / fallback | Element type | Current color | Property to theme | Notes |
|---|---|---|---|---|---|
| Nav label | `NavItem_ButtonLabel` | TextBlock | Fg `#FFFFFF` | Foreground | DONE |
| Nav icon | ? | ? | ? | Foreground/Fill | glyph/icon next to label |
| Selected nav highlight (purple) | ? | Grid/Border | ? | Background | the highlighted item container |
| Sidebar / nav container bg | ? | Grid | ? | Background | left panel background |
| Search bar | ? | Grid/Border/TextBox | ? | Background/BorderBrush | top search field |
| Game tile / card bg | ? | Grid/Border | ? | Background | Game Pass cards |
| Top header area | ? | Grid | ? | Background | account/notification row |
| App / page background | ? | Grid | ? | Background | main content backdrop |
