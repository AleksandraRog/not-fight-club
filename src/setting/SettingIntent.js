import { fromEvent, merge } from "rxjs";
import { map } from "rxjs";

export function intentSetting(dom) {
  const editToggle$ = fromEvent(dom.querySelector(".edit-button"), "click").pipe(
    map(() => ({ type: "EDIT_TOGGLE" }))
  );

  const inputChange$ = fromEvent(dom.querySelector(".character-name"), "change").pipe(
    map(e => ({ type: "SAVE_NAME", payload: e.target.value }))
  );

  return merge(editToggle$, inputChange$);
}