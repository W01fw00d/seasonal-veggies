import { StrictMode, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";

import "../../src/index.css";

type StoryModule = Record<string, ComponentType<Record<string, unknown>>>;

const stories = import.meta.glob<StoryModule>(
  "../../src/**/*.story.{tsx,jsx}",
);
const storyPath = (file: string) =>
  file.replace(/^\.\.\/\.\.\/src\//, "").replace(/\.story\.\w+$/, "");

async function resolveStory(storyId: string) {
  const separator = storyId.lastIndexOf("/");
  const path = storyId.slice(0, separator);
  const exportName = storyId.slice(separator + 1);
  const file = Object.keys(stories).find(
    (candidate) =>
      storyPath(candidate) === path ||
      storyPath(candidate).endsWith(`/${path}`),
  );

  if (!file) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  const module = await stories[file]();
  const Story = module[exportName] ?? module.default;

  if (!Story) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  return Story;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Gallery root element is missing");
}

let root: Root | undefined;

declare global {
  interface Window {
    mount: (params: {
      story: string;
      props?: Record<string, unknown>;
    }) => Promise<void>;
    unmount: () => Promise<void>;
  }
}

window.mount = async ({ story, props = {} }) => {
  const Story = await resolveStory(story);
  root ??= createRoot(rootElement);

  flushSync(() => {
    root?.render(
      <StrictMode>
        <Story {...props} />
      </StrictMode>,
    );
  });
};

window.unmount = async () => {
  root?.unmount();
  root = undefined;
};
