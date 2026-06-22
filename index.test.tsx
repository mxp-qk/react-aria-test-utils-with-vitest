import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { User } from "@react-aria/test-utils";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Select,
  SelectValue,
  SubmenuTrigger,
} from "react-aria-components";

let testUtilUser = new User({ interactionType: "mouse" });

test("Test select", async () => {
  const screen = await render(
    <Select data-testid="test-select">
      <Label>Favorite Animal</Label>
      <Button>
        <SelectValue />
        <span aria-hidden="true">▼</span>
      </Button>
      <Popover>
        <ListBox>
          <ListBoxItem>Aardvark</ListBoxItem>
          <ListBoxItem>Cat</ListBoxItem>
          <ListBoxItem>Dog</ListBoxItem>
          <ListBoxItem>Kangaroo</ListBoxItem>
          <ListBoxItem>Panda</ListBoxItem>
          <ListBoxItem>Snake</ListBoxItem>
        </ListBox>
      </Popover>
    </Select>,
  );

  let selectTester = testUtilUser.createTester("Select", {
    root: screen.getByTestId("test-select").element() as HTMLElement,
    interactionType: "keyboard",
    advanceTimer: (time) => vi.advanceTimersByTime(time),
  });
  let trigger = selectTester.getTrigger();
  expect(trigger).toHaveTextContent("Select an item");

  await selectTester.toggleOptionSelection({ option: "Cat" });
  expect(trigger).toHaveTextContent("Cat");
});

test("Test menu", async () => {
  const screen = await render(
    <MenuTrigger>
      <Button aria-label="Menu" data-testid="test-menutrigger">
        ☰
      </Button>
      <Popover>
        <Menu>
          <MenuItem onAction={() => alert("open")}>Open</MenuItem>
          <MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
          <MenuItem onAction={() => alert("duplicate")}>Duplicate</MenuItem>
          <MenuItem onAction={() => alert("share")}>Share…</MenuItem>
          <MenuItem onAction={() => alert("delete")}>Delete…</MenuItem>
          <SubmenuTrigger>
            <MenuItem>More...</MenuItem>
            <Popover>
              <Menu>
                <MenuItem onAction={() => alert("open")}>Open</MenuItem>
                <MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
                <MenuItem onAction={() => alert("duplicate")}>
                  Duplicate
                </MenuItem>
                <MenuItem onAction={() => alert("share")}>Share…</MenuItem>
                <MenuItem onAction={() => alert("delete")}>Delete…</MenuItem>
              </Menu>
            </Popover>
          </SubmenuTrigger>
        </Menu>
      </Popover>
    </MenuTrigger>,
  );
  let menuTester = testUtilUser.createTester("Menu", {
    root: screen.getByTestId("test-menutrigger").element() as HTMLElement,
    interactionType: "keyboard",
    advanceTimer: (time) => vi.advanceTimersByTime(time),
  });

  await menuTester.open();
  expect(menuTester.getMenu()).toBeInTheDocument();
  let submenuTriggers = menuTester.getSubmenuTriggers();
  expect(submenuTriggers).toHaveLength(1);

  let submenuTester = await menuTester.openSubmenu({
    submenuTrigger: "More...",
  });
  expect(submenuTester.getMenu()).toBeInTheDocument();

  await submenuTester.toggleOptionSelection({
    option: submenuTester.getOptions()[0],
  });
  expect(submenuTester.getMenu()).not.toBeInTheDocument();
  expect(menuTester.getMenu()).not.toBeInTheDocument();
});
