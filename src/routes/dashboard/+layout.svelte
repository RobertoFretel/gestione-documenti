<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  
  import Button from "$lib/components/ui/button/button.svelte";
  import AddIcon from "@lucide/svelte/icons/file-plus"
  
  import { useCompleteAuth } from "$lib";
  import { setDocumentsState } from "$lib/hooks/documents.svelte";
  
  let { children, data } = $props();
  
  let token = $derived(data.token);
  useCompleteAuth(() => token)
  setDocumentsState(() => data.docs)

</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full h-dvh flex flex-col overflow-hidden">
    <header class="w-full h-20 p-4 flex justify-between items-center shrink-0 border-b bg-background">
      <div class="h-full flex gap-4 items-center">
        <Sidebar.Trigger />
        <h1 class="font-medium">Gestione dei documenti</h1>
      </div>
      <div class="h-full flex gap-4 items-center">
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          class="font-bold flex items-center aspect-square rounded-full text-xl"
        >
          <AddIcon class="w-full h-full" />
        </Button>
      </div>
    </header>
    <section class="w-full flex-1 overflow-y-scroll">
      {@render children?.()}
    </section>
  </main>
</Sidebar.Provider>