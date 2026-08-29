import { getContext, setContext } from "svelte";
import { CalendarDate } from "@internationalized/date";
import type { DocumentsResponse } from "$lib/pocketbase-types";

const MODIFICATION_STATE = Symbol("MODIFICATION_STATE");

class ModificationState {
  modificationOpen = $state<boolean>(false);
  descrizione = $state<string>("");
  selectedCalendarDate = $state<CalendarDate | undefined>();
  selectedTimeValue = $state<string>("10:30");
  private getSelectedDoc: () => DocumentsResponse | undefined;

  constructor(selectedDoc: () => DocumentsResponse | undefined) {
    this.getSelectedDoc = selectedDoc
    
    $effect(() => {
      const record = this.getSelectedDoc();
      if (!this.modificationOpen) {
        if (record) {
          this.descrizione = record.descrizione ?? "";
          const docDate = this.adjustTimeZone(new Date(record.docTime));
          this.selectedCalendarDate = new CalendarDate(
            docDate.getFullYear(), 
            docDate.getMonth() + 1, 
            docDate.getDate()
          );
          this.selectedTimeValue = docDate.toLocaleTimeString("it-IT", { 
            hour: "2-digit", 
            minute: "2-digit"
          });
        }
      }
    });
  }

  adjustTimeZone(d: Date) {
    const dateCopy = new Date(d);
    dateCopy.setHours(dateCopy.getHours() + dateCopy.getTimezoneOffset() / 60);
    return dateCopy;
  }

  get drawerDoc() {
    return this.getSelectedDoc();
  }

  get modificationOpened() {
    return this.modificationOpen;
  }

  set modificationOpened(open: boolean) {
    this.modificationOpen = open;
  }

  combineDateAndTime(cDate: CalendarDate | undefined, timeStr: string): Date | null {
    if (!cDate) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newD = new Date(cDate.year, cDate.month - 1, cDate.day, hours || 0, minutes || 0);
    newD.setHours(newD.getHours() - newD.getTimezoneOffset() / 60);
    return newD
  }
}

export function setModificationState(selectedDoc: () => DocumentsResponse | undefined) {
  return setContext(MODIFICATION_STATE, new ModificationState(selectedDoc));
}

export function getModificationState() {
  return getContext<ModificationState>(MODIFICATION_STATE);
}