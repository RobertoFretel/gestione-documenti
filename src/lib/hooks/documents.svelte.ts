import { setContext, getContext } from 'svelte';
import { pb } from '$lib';
import { toast } from 'svelte-sonner';

import type { CategoryDocsResponse, DocumentsResponse } from "$lib/pocketbase-types";

const DOCS_KEY = Symbol('DOCS_STATE');

export class DocumentsState {
  docsList = $state<DocumentsResponse[]>([]);
  categoryDocs = $state<CategoryDocsResponse[]>([]);
  selectedDocId = $state<string | null>(null);

  constructor(initialData: () => DocumentsResponse[]) {
    this.docsList = initialData();
    this.reloadCategories();

    $effect(() => {
      if (!pb.authStore.isValid) return;

      pb.collection("documents").subscribe<DocumentsResponse>("*", async (e) => {
        switch (e.action) {
          case "create":
            if (!this.docsList.some((d) => d.id === e.record.id)) {
              this.docsList = [...this.docsList, e.record];
            }
            break;
          case "update":
            this.docsList = this.docsList.map((doc) => (doc.id === e.record.id ? e.record : doc));
            break;
          case "delete":
            this.docsList = this.docsList.filter((doc) => doc.id !== e.record.id);
            if (this.selectedDocId === e.record.id) {
              this.selectedDocId = null;
            }
            break;
        }

        await this.reloadCategories();
      });

      return () => {
        pb.collection("documents").unsubscribe("*");
      };
    });
  }

  async reloadCategories() {
    try {
      this.categoryDocs = await pb.collection("categoryDocs").getFullList<CategoryDocsResponse>();
    } catch (err) {
      toast.error("[categoryDocs Fetch Error]: " + err);
    }
  }

  get selectedDoc() {
    return this.docsList.find((doc) => doc.id === this.selectedDocId) ?? null;
  }

  setSelectedDocId(id: string | null) {
    this.selectedDocId = id;
  }
}

export function setDocumentsState(initialData: () => DocumentsResponse[]) {
  const state = new DocumentsState(initialData);
  setContext(DOCS_KEY, state);
  return state;
}

export function getDocumentsState() {
  return getContext<DocumentsState>(DOCS_KEY);
}