<script lang="ts">
  import * as Drawer  from "../ui/drawer/index";
  import DrawerContent from "./modification-content.svelte"
  import * as Accordion from "$lib/components/ui/accordion";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import Button from "../ui/button/button.svelte";
  import DatePicker from "../date-picker.svelte";

  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import NoFavorite from '@lucide/svelte/icons/heart-off';
  import Favorite from '@lucide/svelte/icons/heart';
  
  
  import { getDocumentsState } from "$lib/hooks/documents.svelte";
  import { getModificationState } from "./modification-state.svelte.ts";

  import type { CalendarDate } from "@internationalized/date";

  const drawerState = getModificationState()
  const docState = getDocumentsState()

</script>



<Drawer.Root bind:open={drawerState.modificationOpen}>
  <DrawerContent class="p-4 min-h-1/2">
    {#if drawerState.drawerDoc}
      {@const docs = drawerState.drawerDoc}
      {@const LikeIcon = docs.favorite ? Favorite : NoFavorite}
      <Drawer.Header>
        <Drawer.Title class="text-lg font-bold">{docs.titolo}</Drawer.Title>
      </Drawer.Header>
      
      <section class="h-full w-full px-4">
        <Accordion.Root type="single" class="w-full sm:max-w-[40%]">
          <Accordion.Item value="descrizione">
            <Accordion.Trigger class="px-4">
              <span class="first-letter:uppercase text-ellipsis line-clamp-2">{docs.descrizione}</span>
            </Accordion.Trigger>
            <Accordion.Content class="flex flex-col text-balance pt-4">
              <InputGroup.Root>
                <textarea
                  data-slot="input-group-control"
                  class="first-letter:uppercase flex field-sizing-content min-h-20 w-full resize-none rounded-md bg-transparent px-4 py-2.5 text-sm transition-[color,box-shadow] outline-none"
                  bind:value={drawerState.descrizione}
                ></textarea>
                <InputGroup.Addon align="block-end">
                  <InputGroup.Button class="ms-auto" size="sm" variant="default" onclick={() => {
                    docState.updateDocument(docs.id, { descrizione: drawerState.descrizione })
                  }}>
                    Salva
                  </InputGroup.Button>
                </InputGroup.Addon>
              </InputGroup.Root>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="time">
            <Accordion.Trigger class="px-4">
              <span class="first-letter:uppercase text-ellipsis line-clamp-2 flex-1">
                {new Date(docs.docTime).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
            </Accordion.Trigger>
            <Accordion.Content class="flex flex-col gap-4 text-balance pt-4">
              <DatePicker
                bind:value={drawerState.selectedCalendarDate}
                bind:timeValue={drawerState.selectedTimeValue}
              />
              <Button 
                size="sm" 
                class="ms-auto"
                onclick={async () => {
                  const updatedDate = drawerState.combineDateAndTime(drawerState.selectedCalendarDate, drawerState.selectedTimeValue);
                  if (updatedDate) {
                    await docState.updateDocument(docs.id, { 
                      docTime: updatedDate.toISOString() 
                    });
                  }
                }}
              >
                Salva Data
              </Button>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>

      <Drawer.Footer class="flex flex-row gap-4">
        <Button class="aspect-square" variant="outline" onclick={() => drawerState.modificationOpen = false}>
          <ChevronLeft />
        </Button>
        <Button 
          variant="destructive" 
          class="flex-1"
          onclick={async () => {
            drawerState.modificationOpen = false;
            await docState.deleteDocument(docs.id);
          }}
        >
          Elimina
        </Button>
        <Button variant="outline" size="sm" onclick={() => docState.toggleFavorite(docs.id)}>
          <LikeIcon />
        </Button>
      </Drawer.Footer>
    {:else}
      <div class="w-full h-full flex justify-center items-center">
        <span>Caricamento...</span>
      </div>
    {/if}
  </DrawerContent>
</Drawer.Root>