<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import { getDocumentsState } from '$lib/hooks/documents.svelte';
  import { pb } from "$lib";

  const docState = getDocumentsState()
  let trigger = $state(0);

  let futureDocs = $derived.by(() => {
    const _ = trigger;
    const now = Date.now();

    return docState.docsList
      .filter(doc => new Date(doc.docTime).getTime() > now)
      .sort((a, b) => {
        const timeA = new Date(a.docTime).getTime();
        const timeB = new Date(b.docTime).getTime();
        return (timeA - now) - (timeB - now);
      });
  });

  $effect(() => {
    const docs = futureDocs;
    if (docs.length === 0) return;

    const now = Date.now();
    const nextDocTime = new Date(docs[0].docTime).getTime();
    const timeRemaining = nextDocTime - now;

    if (timeRemaining > 0 && timeRemaining < 2147483647) {
      const timer = setTimeout(() => {
        trigger++;
      }, timeRemaining + 10);

      return () => clearTimeout(timer);
    }
  });

</script>

<main class="w-full min-h-full flex flex-col justify-end items-center gap-4 p-4">
  <section class="h-20 w-full">
    <p class="text-xl font-light first-letter:uppercase">{new Date().toLocaleString("it", { dayPeriod: "long" })}</p>
    <h1 class="first-letter:uppercase font-bold text-2xl">
      {new Date().toLocaleString("it", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
    </h1>
  </section>
  {#if futureDocs.length > 0}
    {@const firstDoc = futureDocs[0]}
    {@const anteprima = firstDoc.attachments.length > 0 ? true : false}
    <Card.Root class="relative mx-auto w-full max-w-xs pt-0 min-h-80">
      <div class="absolute inset-0 z-30 aspect-video bg-black/35"></div>
      {#if anteprima}
        <iframe
          title={firstDoc.titolo}
          src={pb.files.getURL(firstDoc, firstDoc.attachments[0])}
          class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        ></iframe>
      {:else}
        <div
          class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        >
          Nessun anteprima
        </div>
      {/if}
      <Card.Header>
        <Card.Action>
          {#if firstDoc.favorite}
            <Badge variant="secondary">Preferito!</Badge>
          {/if}
        </Card.Action>
        <Card.Title>{firstDoc.titolo}</Card.Title>
        <Card.Description>
          {firstDoc.descrizione}
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button class="w-full" onclick={() => {
          docState.setSelectedDocId = firstDoc.id
        }}>Seleziona documento</Button>
      </Card.Footer>
    </Card.Root>
    <section class="flex-1 w-full flex gap-4">
      <div class="aspect-square h-full flex-1 border border-b rounded-xl p-4">
        <hgroup class="w-full h-full flex flex-col justify-center">
          <h1 class="font-black text-xl">{futureDocs.length - 1}</h1>
          <p class="font-light">documenti in arrivo...</p>
        </hgroup>
      </div>
      <div class="aspect-square h-full flex-1 border border-b rounded-xl p-4">
        <hgroup class="w-full h-full flex flex-col justify-center">
          <h1 class="font-black text-xl">{docState.docsList.length}</h1>
          <p class="font-light">documenti totali!</p>
        </hgroup>
      </div>
    </section>
  {/if}
</main>