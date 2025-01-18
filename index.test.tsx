import { expect, test } from "vitest";
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
  const { getByTestId } = render(
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
    </Select>
  );

  let selectTester = testUtilUser.createTester("Select", {
    root: getByTestId("test-select").element() as HTMLElement,
    interactionType: "keyboard",
  });
  let trigger = selectTester.trigger;
  expect(trigger).toHaveTextContent("Select an item");

  await selectTester.selectOption({ option: "Cat" });
  expect(trigger).toHaveTextContent("Cat");
});

test("Test menu", async () => {
  const { getByTestId } = render(
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
    </MenuTrigger>
  );

  let menuTester = testUtilUser.createTester("Menu", {
    root: getByTestId("test-menutrigger").element() as HTMLElement,
    interactionType: "keyboard",
  });

  await menuTester.open();
  expect(menuTester.menu).toBeInTheDocument();
  let submenuTriggers = menuTester.submenuTriggers;
  expect(submenuTriggers).toHaveLength(1);

  let submenuTester = await menuTester.openSubmenu({
    submenuTrigger: "Share…",
  });

  if (!submenuTester) throw new Error("Submenu not found");

  expect(submenuTester.menu).toBeInTheDocument();

  await submenuTester.selectOption({ option: submenuTester.options()[0] });
  expect(submenuTester.menu).not.toBeInTheDocument();
  expect(menuTester.menu).not.toBeInTheDocument();
});
