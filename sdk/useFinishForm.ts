import { signal } from "@preact/signals";

const isFormFinished = signal(false);

const state = {
  isFormFinished,
};

export const useFinishForm = () => state;
