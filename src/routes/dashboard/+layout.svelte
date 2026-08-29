<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import AddIcon from "@lucide/svelte/icons/file-plus"
  import Label from "$lib/components/ui/label/label.svelte";
  import DatePicker from "$lib/components/date-picker.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  import { useCompleteAuth, pb } from "$lib";
  import { setDocumentsState } from "$lib/hooks/documents.svelte";
  import { setModificationState } from "$lib/components/modification/modification-state.svelte";
  import { CalendarDate } from "@internationalized/date";

  import { cn } from "$lib/utils.js";

  let { children, data } = $props();
  
  let dialogOpen = $state(false)
  let token = $derived(data.token);
  let titolo = $state("")
  let categoria = $state("")

  
  const userState = useCompleteAuth(() => token)
  const docState = setDocumentsState(() => data.docs)
  const drawerState = setModificationState(() => docState.selectedDoc || undefined)

  async function handleSubmit (e: SubmitEvent) {
    e.preventDefault()
    if (userState.isValidPocket) {
      const user = await userState.betterAuth().getSession()
      const updatedDate = drawerState.combineDateAndTime(drawerState.selectedCalendarDate, drawerState.selectedTimeValue);
      if (updatedDate && titolo != "" && user.data?.user.id) {
        try {
          const record = await pb.collection("documents").create({
            titolo: titolo,
            categoria: categoria,
            userId: user.data.user.id,
            docTime: updatedDate.toISOString()
          })

          docState.setSelectedDocId = record.id

        } finally {
          if (docState.selectedDoc) {
            dialogOpen = false;
            drawerState.modificationOpened = true
          }
        }
      }
    }
  }
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={(o) => {
  if (o) {
    const docDate = drawerState.adjustTimeZone(new Date())
    drawerState.selectedCalendarDate = new CalendarDate(
      docDate.getFullYear(), 
      docDate.getMonth() + 1, 
      docDate.getDate()
    );
    drawerState.selectedTimeValue = docDate.toLocaleTimeString("it-IT", { 
      hour: "2-digit", 
      minute: "2-digit"
    });
  }
}}>
  <Sidebar.Provider>
    <AppSidebar />
    <main class="w-full h-dvh flex flex-col overflow-hidden">
      <header class="w-full h-20 p-4 flex justify-between items-center shrink-0 border-b bg-background">
        <div class="h-full flex gap-4 items-center">
          <Sidebar.Trigger />
          <h1 class="font-medium">Gestione dei documenti</h1>
        </div>
        <div class="h-full flex gap-4 items-center">
          <Dialog.Trigger
            type="button"
            class={cn("font-bold flex items-center aspect-square rounded-full text-xl", buttonVariants({ variant: "ghost" }))}
          >
            <AddIcon class="w-full h-full" />
          </Dialog.Trigger>
        </div>
      </header>
      <section class="w-full flex-1 overflow-y-scroll">
        {@render children?.()}
      </section>
    </main>
  </Sidebar.Provider>
  <Dialog.Content>
    <form onsubmit={handleSubmit} class="sm:max-w-106.25 contents">
      <Dialog.Header>
        <Dialog.Title>Aggiungi un documento</Dialog.Title>
        <Dialog.Description>
          Parti aggiungendo titolo e data (obbligatoria perche serve per ordinare i dati).
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4">
       <div class="grid gap-3">
          <Label for="titolo">Titolo</Label>
          <Input id="titolo" name="titolo" bind:value={titolo} />
       </div>
       <div class="grid gap-3">
          <Label for="titolo">Categoria</Label>
          <Input id="titolo" name="titolo" bind:value={categoria} />
       </div>
       <div class="grid gap-3">
          <DatePicker
            bind:value={drawerState.selectedCalendarDate}
            bind:timeValue={drawerState.selectedTimeValue}
          />
       </div>
      </div>
      <Dialog.Footer>
        <Dialog.Close
          type="button"
          class={buttonVariants({ variant: "outline" })}
        >
          Annulla
        </Dialog.Close>
        <Button type="submit">Prosegui</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>