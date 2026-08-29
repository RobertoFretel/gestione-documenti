<script lang="ts">
  import { Drawer as DrawerPrimitive } from "vaul-svelte";
  import * as Card from "$lib/components/ui/card";
  
  import Button from "$lib/components/ui/button/button.svelte";
  import { Spinner } from "$lib/components/ui/spinner";
  
  import { cn } from "$lib/utils.js";
  import { pb } from '$lib';
  
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import UploadCloud from "@lucide/svelte/icons/upload-cloud";
  import SaveIcon from "@lucide/svelte/icons/save"
  
  import { getDocumentsState } from '$lib/hooks/documents.svelte';
  import type { FileNameString } from "$lib/pocketbase-types";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DrawerPrimitive.OverlayProps = $props();

  const docState = getDocumentsState();
  let inputFiles = $state<string[]>([]);
  let inCollectionFiles = $state<FileNameString[]>([]);

  let isUploading = $state(false);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!fileInputRef || !docState.selectedDoc) return;
    isUploading = true;

    await docState.removeAttachment(docState.selectedDoc.id, inCollectionFiles);
    if (fileInputRef.files && fileInputRef.files.length > 0) {
      try {
        await docState.addAttachments(docState.selectedDoc.id, fileInputRef.files)
      } finally {
        isUploading = false;
        fileInputRef.value = ""
        inputFiles = []
      }
    } else {
      isUploading = false;
    }
  }

</script>

{#if docState.selectedDoc}
  {@const currentDoc = docState.selectedDoc}
  <DrawerPrimitive.Overlay
    bind:ref
    data-slot="drawer-overlay"
    class={cn("p-4 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50", className)}
    {...restProps}
  >
    <div 
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      class="w-full max-w-lg h-1/2 pb-4 pointer-events-auto outline-none"
      onclick={(e) => e.stopPropagation()}
      onpointerdown={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <form onsubmit={handleSubmit} class="w-full h-full">
        <Card.Root class="w-full h-full flex flex-col">
          <Card.Header>
            <Card.Description>
              Gestisci gli allegati per <span class="font-medium text-foreground">{currentDoc.titolo}</span>
            </Card.Description>
          </Card.Header>

          <Card.Content class="w-full flex-1 overflow-y-auto">
            {#if currentDoc.attachments}
              <div class="flex flex-col gap-2">
                {#each inputFiles as file}
                  <div class="flex items-center justify-between p-2 rounded-md border bg-muted/40 text-sm">
                    <span class="truncate max-w-50 font-mono text-xs">{file}</span>
                    <div class="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        class="h-8 w-8 text-destructive hover:text-destructive"
                        onclick={() => inputFiles = inputFiles.filter(f => f != file)}
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                {/each}
                {#each currentDoc.attachments as file}
                  {@const fileUrl = pb.files.getURL(currentDoc, file)}
                  {@const sbarrato = inCollectionFiles.includes(file) ? "line-through" : ""}
                  <div class="flex items-center justify-between p-2 rounded-md border bg-muted/40 text-sm">
                    <span class={cn("truncate max-w-50 font-mono text-xs", sbarrato)}>{file}</span>
                    <div class="flex items-center gap-1">
                      <Button
                        href={fileUrl} 
                        target="_blank" 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        class="h-8 w-8"
                      >
                        <ExternalLink class="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        class="h-8 w-8 text-destructive hover:text-destructive"
                        onclick={() => {
                          if (inCollectionFiles.includes(file)) {
                            inCollectionFiles = inCollectionFiles.filter(f => f != file)
                          } else {
                            inCollectionFiles.push(file)
                          }
                        }}
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                Nessun allegato presente.
              </div>
            {/if}
          </Card.Content>
          <Card.Footer class="border-t px-4 py-0 flex justify-between items-center gap-2">
            <input 
              type="file" 
              multiple 
              class="hidden" 
              bind:this={fileInputRef}
              onchange={(e) => {
                if (!e.currentTarget.files) return;
                for (const file of Array.from(e.currentTarget.files)) {
                  inputFiles.push(file.name)
                }
              }}
            />
            <Button 
              type="button"
              variant="default" 
              disabled={isUploading}
              onclick={() => fileInputRef?.click()}
              class="flex-1 flex items-center gap-2"
            >
              {#if isUploading}
                <Spinner class="h-4 w-4" />
                Caricamento...
              {:else}
                <UploadCloud class="h-4 w-4" />
                Aggiungi allegati
              {/if}
            </Button>
            <Button disabled={isUploading} type="submit" variant="secondary" class="flex-1 flex items-center gap-2">
              <SaveIcon class="h-4 w-4" />
              Salva
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </div>
  </DrawerPrimitive.Overlay>
{/if}