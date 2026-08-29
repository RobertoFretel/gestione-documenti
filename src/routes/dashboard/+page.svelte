<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group"
  import * as Card from "$lib/components/ui/card";
  import * as Item from "$lib/components/ui/item";
  
  import { Spinner } from "$lib/components/ui/spinner"
  
  import { getDocumentsState } from "$lib/hooks/documents.svelte";
  const docState = getDocumentsState()
</script>

<main class="w-full min-h-full p-4 pb-24 relative">
  {#if docState.categoryDocs.length === 0}
    <section class="w-full h-screen flex justify-center items-center">
      <Spinner />
    </section>
  {:else}
    <RadioGroup.Root 
      value={docState.selectedDocId ?? ""} 
      onValueChange={(v) => docState.setSelectedDocId(v)}
    >
      {#each docState.categoryDocs as categoryDocs}
        <section class="flex flex-col gap-4">
          <h1 class="text-xl capitalize font-bold pt-4">{categoryDocs.categoria}</h1>
          <Card.Root class="p-0">
            <Card.Content class="px-0">
              {#each categoryDocs.docs as finalDocs (finalDocs.id)}
                <Item.Root 
                  for={finalDocs.id} 
                  class="select-none active:bg-accent/50"
                >
                  <Item.Content class="pointer-events-none">
                    <Item.Title>{finalDocs.titolo}</Item.Title>
                    <Item.Description>{finalDocs.descrizione}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="p-2 pointer-events-none">
                    <RadioGroup.Item value={finalDocs.id} id={finalDocs.id} />
                  </Item.Actions>
                </Item.Root>
              {/each}
            </Card.Content>
          </Card.Root>
        </section>  
      {/each}
    </RadioGroup.Root>
  {/if}
</main>
