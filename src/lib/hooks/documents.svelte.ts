import { setContext, getContext } from 'svelte';
import { pb } from '$lib';
import { toast } from 'svelte-sonner';

import type { CategoryDocsResponse, DocumentsResponse, DocumentsRecord } from "$lib/pocketbase-types";

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

  set setSelectedDocId(id: string | null) {
    this.selectedDocId = id;
  }

  async addAttachments(docId: string, files: FileList | File[]) {
    if (!files.length) return;

    for (const file of Array.from(files)) {
      try {
        const updatedRecord = await pb.collection('documents').update(docId, {
          "attachments+": file
        });
        this.docsList = this.docsList.map((doc) => (doc.id === docId ? updatedRecord : doc));
        toast.success(file.name + " caricato con successo");
      } catch (err) {
        toast.error('Errore durante il caricamento degli allegati');
      }
    }
  }

  async removeAttachment(docId: string, fileNames: string[]) {
    console.log("documents.svelte.ts: " + fileNames)
    try {
      const updatedRecord = await pb.collection('documents').update<DocumentsResponse>(docId, {
        "attachments-": [...fileNames]
      });

      this.docsList = this.docsList.map((doc) => (doc.id === docId ? updatedRecord : doc));
      toast.success("Allegato rimosso");
    } catch (err) {
      toast.error("Errore durante la rimozione dell'allegato");
    }
  }

  async toggleFavorite(id: string) {
    if (this.selectedDoc) {
      await this.updateDocument(id, { favorite: !this.selectedDoc.favorite });
    }
  }

  async updateDocument(id: string, data: Partial<DocumentsRecord>) {
  try {
    const { attachments, ...cleanData } = data;

    const updatedRecord = await pb.collection('documents').update<DocumentsResponse>(id, cleanData);
    this.docsList = this.docsList.map((doc) => (doc.id === id ? updatedRecord : doc));
    toast.success("Update eseguito con successo!");
  } catch (err) {
    toast.error('Errore aggiornamento documento');
  }
}

  async deleteDocument(id: string) {
    try {
      // 1. Cancella dal database
      await pb.collection('documents').delete(id);
      
      // 2. Rimuovi immediatamente lo stato locale
      this.docsList = this.docsList.filter((doc) => doc.id !== id);

      if (this.selectedDocId === id) {
        this.selectedDocId = null;
      }
      
      toast.success("Documento eliminato");
    } catch (err) {
      toast.error('Errore eliminazione documento');
    }
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